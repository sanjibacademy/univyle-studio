import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { initialSeedData } from "@/data/seedData";
import { AppData, AIPrompt, BlogPost, Lead, Booking, SiteSettings, PurchaseRequest, PurchaseStatus, PremiumPack } from "@/types";

const DATA_FILE = path.join(process.cwd(), "data.json");

let cachedData: AppData | null = null;

// Helper to load data
function loadData(): AppData {
  if (cachedData) {
    return cachedData;
  }
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const raw = JSON.parse(content);
      // Ensure new fields exist (forward compat)
      if (!raw.premiumPacks) raw.premiumPacks = [];
      if (!raw.purchaseRequests) raw.purchaseRequests = [];
      if (!raw.stats.totalPurchaseRequests) raw.stats.totalPurchaseRequests = 0;
      cachedData = raw;
      return cachedData!;
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeedData, null, 2), "utf-8");
      cachedData = JSON.parse(JSON.stringify(initialSeedData));
      return cachedData!;
    }
  } catch (err) {
    console.error("Error loading data.json, falling back to seed data", err);
    return initialSeedData;
  }
}

// Helper to save data
function saveAllData(data: AppData) {
  cachedData = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving data.json", err);
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ route?: string[] }> }
) {
  const params = await context.params;
  const route = params.route || [];
  const routePath = route.join("/");

  // GET /api/data
  if (routePath === "data") {
    const data = loadData();
    data.stats.simulatedViews += Math.floor(Math.random() * 3) + 1;
    return NextResponse.json(data);
  }

  // GET /api/packs
  if (routePath === "packs") {
    const data = loadData();
    return NextResponse.json(data.premiumPacks);
  }

  // DELETE /api/purchases/[id]
  if (route[0] === "purchases" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.purchaseRequests.filter((r) => r.id !== id);
    if (filtered.length !== data.purchaseRequests.length) {
      data.purchaseRequests = filtered;
      data.stats.totalPurchaseRequests = filtered.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ route?: string[] }> }
) {
  const params = await context.params;
  const route = params.route || [];
  const routePath = route.join("/");

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    // Empty body or non-JSON
  }

  // POST /api/admin/login
  if (routePath === "admin/login") {
    const { password } = body;
    if (password === "admin123") {
      return NextResponse.json({ success: true, token: "univyle-admin-secure-token-2026" });
    } else {
      return NextResponse.json(
        { success: false, message: "ভুল পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন।" },
        { status: 401 }
      );
    }
  }

  // POST /api/prompts
  if (routePath === "prompts") {
    const newPrompt: AIPrompt = body;
    const data = loadData();
    newPrompt.id = "p-" + Date.now();
    newPrompt.createdAt = new Date().toISOString();
    newPrompt.likes = 0;
    newPrompt.copyCount = 0;
    data.prompts.unshift(newPrompt);
    data.stats.totalPrompts = data.prompts.length;
    saveAllData(data);
    return NextResponse.json({ success: true, prompt: newPrompt }, { status: 201 });
  }

  // POST /api/prompts/[id]/copy
  if (route[0] === "prompts" && route[2] === "copy") {
    const id = route[1];
    const data = loadData();
    const prompt = data.prompts.find((p) => p.id === id);
    if (prompt) {
      prompt.copyCount += 1;
      data.stats.totalCopies += 1;
      data.stats.adRevenue += 0.05;
      saveAllData(data);
      return NextResponse.json({
        success: true,
        copyCount: prompt.copyCount,
        adRevenue: data.stats.adRevenue,
      });
    }
    return NextResponse.json({ success: false, message: "Prompt not found" }, { status: 404 });
  }

  // POST /api/prompts/[id]/like
  if (route[0] === "prompts" && route[2] === "like") {
    const id = route[1];
    const data = loadData();
    const prompt = data.prompts.find((p) => p.id === id);
    if (prompt) {
      prompt.likes += 1;
      saveAllData(data);
      return NextResponse.json({ success: true, likes: prompt.likes });
    }
    return NextResponse.json({ success: false, message: "Prompt not found" }, { status: 404 });
  }

  // POST /api/blogs
  if (routePath === "blogs") {
    const newBlog: BlogPost = body;
    const data = loadData();
    newBlog.id = "b-" + Date.now();
    newBlog.createdAt = new Date().toISOString();
    data.blogs.unshift(newBlog);
    saveAllData(data);
    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 });
  }

  // POST /api/leads
  if (routePath === "leads") {
    const { name, email, service, message } = body;
    if (!name || !email || !service || !message) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে সব তথ্য পূরণ করুন।" },
        { status: 400 }
      );
    }
    const data = loadData();
    const newLead: Lead = {
      id: "l-" + Date.now(),
      name,
      email,
      service,
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    data.leads.unshift(newLead);
    data.stats.totalLeads = data.leads.length;
    saveAllData(data);
    return NextResponse.json(
      {
        success: true,
        lead: newLead,
        message: "আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! UNIVYLE Studio খুব শীঘ্রই যোগাযোগ করবে।",
      },
      { status: 201 }
    );
  }

  // POST /api/bookings
  if (routePath === "bookings") {
    const { name, email, phone, course, preferredTime, notes } = body;
    if (!name || !email || !phone || !course || !preferredTime) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে সব তথ্য পূরণ করুন।" },
        { status: 400 }
      );
    }
    const data = loadData();
    const newBooking: Booking = {
      id: "bk-" + Date.now(),
      name,
      email,
      phone,
      course,
      preferredTime,
      notes,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    data.bookings.unshift(newBooking);
    data.stats.totalBookings = data.bookings.length;
    saveAllData(data);
    return NextResponse.json(
      {
        success: true,
        booking: newBooking,
        message: "বুকিং সফল হয়েছে! ক্লাসের তথ্য এবং পরামর্শের জন্য আপনাকে খুব শীঘ্রই কল করা হবে।",
      },
      { status: 201 }
    );
  }

  // POST /api/purchases
  if (routePath === "purchases") {
    const { packId, packName, packPrice, currency, name, email, phone, country, notes } = body;
    if (!name || !email || !phone || !country || !packId) {
      return NextResponse.json(
        { success: false, message: "অনুগ্রহ করে সব তথ্য পূরণ করুন।" },
        { status: 400 }
      );
    }
    const data = loadData();
    const newRequest: PurchaseRequest = {
      id: "pr-" + Date.now(),
      packId,
      packName,
      packPrice,
      currency: currency || "BDT",
      name,
      email,
      phone,
      country,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    data.purchaseRequests.unshift(newRequest);
    data.stats.totalPurchaseRequests = data.purchaseRequests.length;
    saveAllData(data);
    return NextResponse.json(
      {
        success: true,
        request: newRequest,
        message: "আপনার ক্রয়ের অনুরোধ পাঠানো হয়েছে! WhatsApp-এ payment বিস্তারিত নিয়ে শীঘ্রই যোগাযোগ করা হবে।",
      },
      { status: 201 }
    );
  }

  // POST /api/portfolio
  if (routePath === "portfolio") {
    const item = body;
    const data = loadData();
    item.id = "port-" + Date.now();
    data.portfolio.unshift(item);
    saveAllData(data);
    return NextResponse.json({ success: true, item });
  }

  // DELETE /api/purchases/[id]
  if (route[0] === "purchases" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.purchaseRequests.filter((r) => r.id !== id);
    if (filtered.length !== data.purchaseRequests.length) {
      data.purchaseRequests = filtered;
      data.stats.totalPurchaseRequests = filtered.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ route?: string[] }> }
) {
  const params = await context.params;
  const route = params.route || [];
  const routePath = route.join("/");

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {}

  // PUT /api/prompts/[id]
  if (route[0] === "prompts" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const index = data.prompts.findIndex((p) => p.id === id);
    if (index !== -1) {
      data.prompts[index] = { ...data.prompts[index], ...body };
      saveAllData(data);
      return NextResponse.json({ success: true, prompt: data.prompts[index] });
    }
    return NextResponse.json({ success: false, message: "Prompt not found" }, { status: 404 });
  }

  // PUT /api/blogs/[id]
  if (route[0] === "blogs" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const index = data.blogs.findIndex((b) => b.id === id);
    if (index !== -1) {
      data.blogs[index] = { ...data.blogs[index], ...body };
      saveAllData(data);
      return NextResponse.json({ success: true, blog: data.blogs[index] });
    }
    return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
  }

  // PUT /api/leads/[id]
  if (route[0] === "leads" && route.length === 2) {
    const id = route[1];
    const { status } = body;
    const data = loadData();
    const index = data.leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      data.leads[index].status = status;
      saveAllData(data);
      return NextResponse.json({ success: true, lead: data.leads[index] });
    }
    return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
  }

  // PUT /api/bookings/[id]
  if (route[0] === "bookings" && route.length === 2) {
    const id = route[1];
    const { status } = body;
    const data = loadData();
    const index = data.bookings.findIndex((b) => b.id === id);
    if (index !== -1) {
      data.bookings[index].status = status;
      saveAllData(data);
      return NextResponse.json({ success: true, booking: data.bookings[index] });
    }
    return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  }

  // PUT /api/purchases/[id]
  if (route[0] === "purchases" && route.length === 2) {
    const id = route[1];
    const { status, paymentMethod, paymentNote } = body;
    const data = loadData();
    const index = data.purchaseRequests.findIndex((r) => r.id === id);
    if (index !== -1) {
      data.purchaseRequests[index].status = status;
      if (paymentMethod) data.purchaseRequests[index].paymentMethod = paymentMethod;
      if (paymentNote) data.purchaseRequests[index].paymentNote = paymentNote;
      data.purchaseRequests[index].updatedAt = new Date().toISOString();
      saveAllData(data);
      return NextResponse.json({ success: true, request: data.purchaseRequests[index] });
    }
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  // PUT /api/settings
  if (routePath === "settings") {
    const data = loadData();
    data.settings = { ...data.settings, ...body };
    saveAllData(data);
    return NextResponse.json({ success: true, settings: data.settings });
  }

  // DELETE /api/purchases/[id]
  if (route[0] === "purchases" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.purchaseRequests.filter((r) => r.id !== id);
    if (filtered.length !== data.purchaseRequests.length) {
      data.purchaseRequests = filtered;
      data.stats.totalPurchaseRequests = filtered.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ route?: string[] }> }
) {
  const params = await context.params;
  const route = params.route || [];

  // DELETE /api/prompts/[id]
  if (route[0] === "prompts" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.prompts.filter((p) => p.id !== id);
    if (filtered.length !== data.prompts.length) {
      data.prompts = filtered;
      data.stats.totalPrompts = data.prompts.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Prompt not found" }, { status: 404 });
  }

  // DELETE /api/blogs/[id]
  if (route[0] === "blogs" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.blogs.filter((b) => b.id !== id);
    if (filtered.length !== data.blogs.length) {
      data.blogs = filtered;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
  }

  // DELETE /api/leads/[id]
  if (route[0] === "leads" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.leads.filter((l) => l.id !== id);
    if (filtered.length !== data.leads.length) {
      data.leads = filtered;
      data.stats.totalLeads = data.leads.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
  }

  // DELETE /api/bookings/[id]
  if (route[0] === "bookings" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.bookings.filter((b) => b.id !== id);
    if (filtered.length !== data.bookings.length) {
      data.bookings = filtered;
      data.stats.totalBookings = data.bookings.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Booking not found" }, { status: 404 });
  }

  // DELETE /api/portfolio/[id]
  if (route[0] === "portfolio" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    data.portfolio = data.portfolio.filter((p) => p.id !== id);
    saveAllData(data);
    return NextResponse.json({ success: true });
  }

  // DELETE /api/purchases/[id]
  if (route[0] === "purchases" && route.length === 2) {
    const id = route[1];
    const data = loadData();
    const filtered = data.purchaseRequests.filter((r) => r.id !== id);
    if (filtered.length !== data.purchaseRequests.length) {
      data.purchaseRequests = filtered;
      data.stats.totalPurchaseRequests = filtered.length;
      saveAllData(data);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}
