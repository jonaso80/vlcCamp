import React, { useState } from 'react';
import { useTranslations } from '../context/LanguageContext';
import { PhoneIcon } from './icons/Icons';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const { t } = useTranslations();
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2E4053] mb-3">{t('contactPage.title')}</h1>
        <p className="text-lg text-slate-600">{t('contactPage.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Form */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-white/50">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">{t('contactPage.formTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1">
                {t('contactPage.name')}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder={t('contactPage.namePlaceholder')}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA] outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1">
                {t('contactPage.email')}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('contactPage.emailPlaceholder')}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA] outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1">
                {t('contactPage.subject')}
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder={t('contactPage.subjectPlaceholder')}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA] outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">
                {t('contactPage.message')}
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder={t('contactPage.messagePlaceholder')}
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#8EB8BA] focus:border-[#8EB8BA] outline-none transition resize-y min-h-[120px]"
              />
            </div>
            {status === 'success' && (
              <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{t('contactPage.success')}</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-700 bg-red-50 rounded-lg px-3 py-2">{t('contactPage.error')}</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full py-3 px-4 rounded-lg bg-[#8EB8BA] text-white font-semibold hover:bg-[#7aa8ab] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? t('contactPage.sending') : t('contactPage.send')}
            </button>
          </form>
        </div>

        {/* Contact info */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-800">{t('contactPage.infoTitle')}</h2>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/50 space-y-5">
            <a
              href="tel:+34123456789"
              className="flex items-center gap-3 text-slate-700 hover:text-[#8EB8BA] transition"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8EB8BA]/20 text-[#8EB8BA]">
                <PhoneIcon />
              </span>
              <div>
                <span className="text-sm font-medium text-slate-500 block">{t('contactPage.phone')}</span>
                <span className="font-medium">+34 123 456 789</span>
              </div>
            </a>
            <a
              href="mailto:info.campvlc@gmail.com"
              className="flex items-center gap-3 text-slate-700 hover:text-[#8EB8BA] transition"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8EB8BA]/20 text-[#8EB8BA]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <div>
                <span className="text-sm font-medium text-slate-500 block">{t('contactPage.emailLabel')}</span>
                <span className="font-medium">info.campvlc@gmail.com</span>
              </div>
            </a>
            <div className="flex items-center gap-3 text-slate-700">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8EB8BA]/20 text-[#8EB8BA]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <span className="text-sm font-medium text-slate-500 block">{t('contactPage.address')}</span>
                <span className="font-medium">{t('contactPage.addressValue')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#8EB8BA]/20 text-[#8EB8BA]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </span>
              <div>
                <span className="text-sm font-medium text-slate-500 block">{t('contactPage.hours')}</span>
                <span className="font-medium">{t('contactPage.hoursValue')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
