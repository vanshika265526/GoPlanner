import React, { useState } from 'react';
import { PageHeader } from './PageHeader';
import { Button } from './Button';

export const ContactUs = ({ onBack, onDashboard, onHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    issueType: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          issueType: 'general'
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader 
        onBack={onBack} 
        onDashboard={onDashboard} 
        title="Contact Us"
        subtitle="We'd love to hear from you"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="glass-panel rounded-[40px] p-8 space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
              <p className="text-slate-700 dark:text-white/70 leading-relaxed">
                Have a question or need help? We're here to assist you. Reach out to us through any of the following channels, and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="glass-panel rounded-[32px] p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Information</h3>
              
              <div className="space-y-4">
                {/* Email */}
                <a
                  href="mailto:vanshika80910@gmail.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-12 h-12 group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60 mb-1">Email</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      support@goplanner.com
                    </p>
                  </div>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/vanshika--/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary w-12 h-12 group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60 mb-1">LinkedIn</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                      Connect with us
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-8 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Response Time</h3>
              <p className="text-slate-700 dark:text-white/70">
                We typically respond within 24-48 hours during business days. For urgent matters, please mention "URGENT" in your subject line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-panel rounded-[40px] p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h2>
              <p className="text-slate-600 dark:text-white/70">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {submitStatus === 'success' && (
              <div className="rounded-2xl bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-800 p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="rounded-2xl bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400">error</span>
                <p className="text-red-800 dark:text-red-300 font-medium">
                  {errorMessage || 'Failed to send message. Please try again.'}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="issueType" className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  Issue Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="general" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">General Inquiry</option>
                  <option value="support" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Technical Support</option>
                  <option value="bug" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Bug Report</option>
                  <option value="feature" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Feature Request</option>
                  <option value="feedback" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Feedback</option>
                  <option value="other" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-colors"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 dark:text-white/80 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-colors resize-none"
                  placeholder="Tell us more about your inquiry or issue..."
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-base shadow-primary/40"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>

        {/* Home Button */}
        {onHome && (
          <div className="mt-12 flex justify-center">
            <Button
              onClick={onHome}
              variant="secondary"
              className="px-8 py-3"
            >
              <span className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M9 22V12h6v10" />
                </svg>
                Back to Home
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

