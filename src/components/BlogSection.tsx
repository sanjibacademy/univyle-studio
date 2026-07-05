import React, { useState } from 'react';
import { Newspaper, Calendar, User, Clock, ArrowLeft, Tag, BookOpen, Share2, Check } from 'lucide-react';
import { BlogPost } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'motion/react';

interface BlogSectionProps {
  blogs: BlogPost[];
}

export default function BlogSection({ blogs }: BlogSectionProps) {
  const { language, t } = useLanguage();
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedBlog = blogs.find(b => b.id === selectedBlogId);

  const handleShareBlog = (id: string) => {
    const shareUrl = `${window.location.origin}?blogId=${id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (selectedBlog) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12" 
        id="blog-reading-view"
      >
        {/* Back navigation */}
        <button
          onClick={() => {
            setSelectedBlogId(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 hover:text-teal-400 transition-colors mb-6 group cursor-pointer"
          id="blog-back-btn"
        >
          <ArrowLeft className="h-4 w-4 transform transition-transform group-hover:-translate-x-1" />
          <span>{t('back_to_articles')}</span>
        </button>

        {/* Cover Image */}
        <div className="relative h-64 sm:h-96 w-full overflow-hidden rounded-2xl border border-zinc-900 shadow-2xl bg-zinc-900 mb-8">
          <img 
            src={selectedBlog.coverImage} 
            alt={selectedBlog.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <span className="inline-flex items-center rounded-md bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20 mb-3">
              {selectedBlog.category}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {selectedBlog.title}
            </h1>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pb-6 border-b border-zinc-900 text-xs text-zinc-500 mb-8">
          <div className="flex items-center space-x-1.5">
            <User className="h-3.5 w-3.5" />
            <span className="text-zinc-300 font-medium">{selectedBlog.author}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(selectedBlog.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{selectedBlog.readTime}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShareBlog(selectedBlog.id)}
            className="ml-auto flex items-center space-x-1.5 text-zinc-400 hover:text-teal-400 transition-colors bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 cursor-pointer"
            id="blog-share-btn"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
            <span>{copiedLink ? t('copied_link') : t('share_article')}</span>
          </motion.button>
        </div>

        {/* Content Body formatted in Markdown style */}
        <article className="prose prose-invert max-w-none text-zinc-300 space-y-6 leading-relaxed text-sm sm:text-base" id="blog-content">
          {selectedBlog.content.split('\n\n').map((para, i) => {
            if (para.startsWith('###')) {
              return <h3 key={i} className="text-lg sm:text-xl font-bold text-white pt-4 mt-6 border-l-2 border-teal-500 pl-3">{para.replace('###', '').trim()}</h3>;
            }
            if (para.startsWith('##')) {
              return <h2 key={i} className="text-xl sm:text-2xl font-bold text-white pt-4 mt-8">{para.replace('##', '').trim()}</h2>;
            }
            if (para.startsWith('-')) {
              return (
                <ul key={i} className="list-disc pl-5 space-y-2">
                  {para.split('\n').map((li, idx) => (
                    <li key={idx} className="text-zinc-400">{li.replace('-', '').trim()}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </article>

        {/* Tags */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-wrap gap-2">
          {selectedBlog.tags.map((tag) => (
            <motion.span 
              whileHover={{ y: -2 }}
              key={tag}
              className="inline-flex items-center space-x-1 bg-zinc-900/60 text-zinc-400 border border-zinc-900 rounded-full px-3 py-1 text-xs cursor-default"
            >
              <Tag className="h-3 w-3 text-teal-400" />
              <span>{tag}</span>
            </motion.span>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12" id="blog-listing-view">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 rounded-full border border-teal-500/20 bg-teal-500/5 px-3 py-1 text-xs font-semibold text-teal-400 mb-3">
          <Newspaper className="h-3.5 w-3.5" />
          <span>{t('blog_badge')}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          {t('blog_title')}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-sm text-zinc-400">
          {t('blog_sub')}
        </p>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
        id="blog-grid"
      >
        {blogs.map((blog) => (
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
            }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 40px -15px rgba(20,241,149,0.08)",
              borderColor: "rgba(20,241,149,0.2)"
            }}
            key={blog.id}
            onClick={() => {
              setSelectedBlogId(blog.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 hover:border-zinc-800 transition-all duration-300 flex flex-col justify-between"
            id={`blog-card-${blog.id}`}
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-zinc-900">
                <img 
                  src={blog.coverImage} 
                  alt={blog.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center rounded-md bg-zinc-950 px-2.5 py-0.5 text-xs font-semibold text-teal-400 border border-zinc-800">
                    {blog.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center space-x-3 text-[10px] text-zinc-500 mb-2.5">
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3 text-teal-400" />
                    <span>{blog.author}</span>
                  </span>
                  <span>•</span>
                  <span>{blog.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors duration-300 leading-snug">
                  {blog.title}
                </h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-400 group-hover:text-teal-300 cursor-pointer"
              >
                <span>{t('read_article')}</span>
                <span>→</span>
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
