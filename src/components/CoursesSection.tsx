import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Check, 
  PhoneCall, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  ArrowUpRight, 
  X, 
  Briefcase, 
  Laptop, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  ChevronRight,
  Target
} from 'lucide-react';
import { Course } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

interface CoursesSectionProps {
  courses: Course[];
  onSubmitBooking: (booking: { name: string; email: string; phone: string; course: string; preferredTime: string; notes?: string }) => Promise<{ success: boolean; message: string }>;
}

export default function CoursesSection({ courses, onSubmitBooking }: CoursesSectionProps) {
  const { language, t } = useLanguage();
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);
  
  // Call Booking Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.title || '');
  const [preferredTime, setPreferredTime] = useState('Morning (9:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !selectedCourse || !preferredTime) {
      setSubmitStatus({ success: false, message: t('fill_all_fields') });
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const res = await onSubmitBooking({
        name,
        email,
        phone,
        course: selectedCourse,
        preferredTime,
        notes
      });
      setSubmitStatus({
        success: res.success,
        message: res.success ? t('booking_success') : t(res.message) || t('booking_failed')
      });
      if (res.success) {
        setName('');
        setEmail('');
        setPhone('');
        setNotes('');
      }
    } catch (err) {
      setSubmitStatus({ success: false, message: t('booking_failed') });
    } finally {
      setSubmitting(false);
    }
  };

  const timeslots = [
    'Morning (9:00 AM - 12:00 PM)',
    'Afternoon (2:00 PM - 5:00 PM)',
    'Evening (6:00 PM - 9:00 PM)',
    'Anytime (Convenient for you)'
  ];

  const handleBookCourseClick = (courseTitle: string) => {
    setSelectedCourse(courseTitle);
    setSelectedDetailCourse(null); // Close modal if open
    const element = document.getElementById('booking-form-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="courses-section">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-400 mb-3 uppercase tracking-wider">
          <Award className="h-3.5 w-3.5" />
          <span>{t('academy_badge')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
          {t('academy_title')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
          {t('academy_sub')}
        </p>
      </div>

      {/* Animated Course grid & Booking split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-16" id="academy-grid">
        {/* Course Cards Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-20px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 }
            }
          }}
          className="lg:col-span-2 space-y-6" 
          id="course-cards-list"
        >
          {courses.map((course) => {
            const tagline = course.tagline || 'Master industry-ready concepts';
            const level = course.level || 'Beginner to Advanced';
            const projectsIncluded = course.projectsIncluded || 'Real-world projects & practical assignments';
            const softwareList = course.softwareMastered || [];
            const careerOpportunities = course.careerOpportunities || [];

            return (
              <motion.div 
                key={course.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                }}
                whileHover={{ 
                  y: -4,
                  borderColor: "rgba(20,241,149,0.2)",
                  boxShadow: "0 20px 40px -15px rgba(20,241,149,0.06)"
                }}
                className="group relative rounded-2xl border bg-zinc-950/40 border-zinc-900 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden shadow-lg"
                id={`course-${course.id}`}
              >
                {/* Visual Highlight for AI Income Project */}
                {course.id === 'c-1' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-teal-500 to-cyan-500 text-zinc-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>{t('top_highlight')}</span>
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-2 items-center mb-3">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-950 shadow-sm ${
                      course.category === 'web' ? 'bg-purple-400' : course.category === 'graphics' ? 'bg-teal-400' : course.category === 'video' ? 'bg-sky-400' : 'bg-amber-400'
                    }`}>
                      {course.category === 'web' ? t('web_dev_tab') : course.category === 'graphics' ? t('graphics_design_tab') : course.category === 'video' ? t('video_editing_tab') : 'AI & Tech'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">{language === 'bn' ? `লেভেল: ${level}` : `Level: ${level}`}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white group-hover:text-teal-400 transition-colors duration-300">
                    {course.title}
                  </h3>
                  
                  <p className="text-teal-400/90 text-xs font-semibold mt-1 italic tracking-wide">
                    "{tagline}"
                  </p>
                  
                  <p className="text-zinc-400 text-xs mt-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Details Block */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/10 border border-zinc-900/50 rounded-xl p-4 text-xs">
                    <div>
                      <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-bold block mb-1">{t('duration_pace')}</span>
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        {course.duration}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-bold block mb-1">{t('hands_on')}</span>
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <Layers className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                        {projectsIncluded}
                      </span>
                    </div>
                  </div>

                  {/* Software Mastered Section */}
                  {softwareList.length > 0 && (
                    <div className="mt-4">
                      <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-bold block mb-2">{t('software_to_master')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {softwareList.map((sw, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2 py-1 text-[10px] font-semibold text-zinc-300 border border-zinc-800"
                          >
                            <Laptop className="h-3 w-3 text-teal-400/80" />
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career Opportunities */}
                  {careerOpportunities.length > 0 && (
                    <div className="mt-4">
                      <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-bold block mb-1.5">{t('career_pathways')}</span>
                      <div className="flex flex-wrap gap-1">
                        {careerOpportunities.map((co, index) => (
                          <span key={index} className="text-zinc-400 text-[11px] font-medium after:content-['•'] last:after:content-none after:mx-1.5 after:text-zinc-700">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Action buttons */}
                <div className="mt-6 flex gap-3 border-t border-zinc-900/60 pt-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDetailCourse(course)}
                    className="flex-1 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    id={`course-detail-btn-${course.id}`}
                  >
                    <span>{t('view_curriculum')}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBookCourseClick(course.title)}
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 text-xs font-black tracking-wider uppercase transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    {t('book_course')}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Booking Form Card */}
        <div 
          id="booking-form-container"
          className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 sm:p-8 shadow-2xl backdrop-blur-md sticky top-6"
        >
          <div className="flex items-center space-x-2 text-teal-400 font-semibold text-xs mb-3">
            <PhoneCall className="h-4 w-4 shrink-0" />
            <span>{t('free_advisory_call').toUpperCase()}</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">{t('free_advisory_call')}</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-6 leading-relaxed">
            {t('free_advisory_sub')}
          </p>

          <form onSubmit={handleBookingSubmit} className="space-y-4" id="course-booking-form">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('your_name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'bn' ? "যেমন: সঞ্জীব সরকার" : "e.g. John Doe"}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('whatsapp_number')}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('email_address')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{language === 'bn' ? 'কোর্স নির্বাচন করুন *' : 'Select Course *'}</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.title}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('speaking_time')}</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              >
                {timeslots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">{t('message_optional')}</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={language === 'bn' ? "আপনার যেকোনো প্রশ্ন লিখুন..." : "Ask any doubts, questions, or share your background..."}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-teal-500/50 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10"
              />
            </div>

            {submitStatus && (
              <div className={`flex items-start space-x-2 rounded-xl p-3 text-xs border ${
                submitStatus.success 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {submitStatus.success ? <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 py-3 px-4 text-sm font-bold text-zinc-950 hover:shadow-[0_0_15px_rgba(20,241,149,0.25)] transition-all disabled:opacity-50 font-black tracking-wider uppercase"
              id="submit-booking-btn"
            >
              {submitting ? (
                <span>{language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Submitting...'}</span>
              ) : (
                <>
                  <PhoneCall className="h-4 w-4" />
                  <span>{t('request_callback')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Immersive Course Details Modal (Coursera / Google Career Certificate style with Framer Motion AnimatePresence) */}
      <AnimatePresence>
        {selectedDetailCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header banner with futuristic styling */}
              <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 sm:p-8 border-b border-zinc-800 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,241,149,0.06),transparent_60%)] pointer-events-none" />
                
                <button 
                  onClick={() => setSelectedDetailCourse(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-wrap gap-2 items-center mb-3">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-zinc-950 shadow-sm ${
                    selectedDetailCourse.category === 'web' ? 'bg-purple-400' : selectedDetailCourse.category === 'graphics' ? 'bg-teal-400' : selectedDetailCourse.category === 'video' ? 'bg-sky-400' : 'bg-amber-400'
                  }`}>
                    {selectedDetailCourse.category === 'web' ? t('web_dev_tab') : selectedDetailCourse.category === 'graphics' ? t('graphics_design_tab') : selectedDetailCourse.category === 'video' ? t('video_editing_tab') : 'AI & Tech'}
                  </span>
                  <span className="text-xs text-teal-400 font-bold tracking-wider uppercase">{t('modal_callback_avail')}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedDetailCourse.title}
                </h3>
                
                <p className="text-zinc-400 text-sm mt-2 font-medium italic">
                  "{selectedDetailCourse.tagline || (language === 'bn' ? 'বাস্তবধর্মী কাজের দক্ষতা অর্জন করুন' : 'Master industry-ready skills')}"
                </p>

                {/* Stats Grid */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-zinc-800/80 pt-5">
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-extrabold block">{t('duration_pace')}</span>
                    <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                      <Clock className="h-4 w-4 text-teal-400" />
                      {selectedDetailCourse.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-extrabold block">{language === 'bn' ? 'স্কিল লেভেল' : 'Skill Level'}</span>
                    <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                      <Target className="h-4 w-4 text-cyan-400" />
                      {selectedDetailCourse.level || (language === 'bn' ? 'বেসিক থেকে এডভান্সড' : 'Beginner to Advanced')}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-zinc-500 uppercase text-[9px] tracking-wider font-extrabold block">{t('hands_on')}</span>
                    <span className="text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 mt-0.5">
                      <Layers className="h-4 w-4 text-purple-400" />
                      {selectedDetailCourse.projectsIncluded || (language === 'bn' ? 'বাস্তবধর্মী প্রজেক্ট' : 'Hands-on practice')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 max-h-[55vh] overflow-y-auto space-y-6 text-zinc-300">
                {/* Overview */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                    <span>{t('course_overview')}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {selectedDetailCourse.overview || selectedDetailCourse.description}
                  </p>
                </div>

                {/* Curriculum Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3.5 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-teal-400" />
                    <span>{t('what_you_will_master')}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-900/30 border border-zinc-900 rounded-xl p-4">
                    {selectedDetailCourse.syllabus.map((item, index) => (
                      <div key={index} className="flex items-start space-x-2.5">
                        <Check className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-zinc-200 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Software, Pathways, and Certificate Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Software Box */}
                  {selectedDetailCourse.softwareMastered && selectedDetailCourse.softwareMastered.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Laptop className="h-4 w-4 text-teal-400" />
                        <span>{t('software_to_master')}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetailCourse.softwareMastered.map((sw, index) => (
                          <span key={index} className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-200 border border-zinc-800">
                            {sw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career opportunities box */}
                  {selectedDetailCourse.careerOpportunities && selectedDetailCourse.careerOpportunities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-teal-400" />
                        <span>{t('career_opportunities')}</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDetailCourse.careerOpportunities.map((co, index) => (
                          <span key={index} className="inline-flex items-center rounded-lg bg-zinc-900/40 px-2 py-1 text-[11px] font-medium text-zinc-400 border border-zinc-900">
                            {co}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Certificate indicator */}
                <div className="border border-teal-500/10 bg-teal-500/5 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-teal-400/10 text-teal-400 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{t('cert_title')}</span>
                      <span className="text-[9px] bg-teal-400 text-zinc-950 font-black uppercase px-1 rounded">{t('cert_tag')}</span>
                    </h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                      {t('cert_desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-zinc-900 bg-zinc-900/20">
                <span className="text-xs text-zinc-400 text-center sm:text-left">
                  {t('modal_footer_hint')}
                </span>
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedDetailCourse(null)}
                    className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 text-xs font-bold transition-all cursor-pointer"
                  >
                    {t('close')}
                  </button>
                  <button
                    onClick={() => handleBookCourseClick(selectedDetailCourse.title)}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-zinc-950 text-xs font-black tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    <span>{t('book_free_call')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
