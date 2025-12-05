import React from 'react';
import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { AppFooter } from './AppFooter';

const FeatureCard = ({ icon, title, description }) => (
  <div className="glass-panel rounded-[32px] p-6 space-y-4 tilt-card hover:scale-[1.02] transition-transform">
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-3">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
    </div>
    <p className="text-slate-700 dark:text-white/70 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ value, label, icon }) => (
  <div className="glass-panel rounded-[32px] p-6 text-center space-y-3">
    <div className="flex items-center justify-center">
      {icon}
    </div>
    <p className="text-4xl font-black text-slate-900 dark:text-white">{value}</p>
    <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">{label}</p>
  </div>
);

export const AboutUs = ({ onBack, onDashboard, onStartPlanning }) => {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s6-5.1 6-10a6 6 0 10-12 0c0 4.9 6 10 6 10z" />
          <circle cx="12" cy="11" r="2.5" />
        </svg>
      ),
      title: 'Smart Destination Planning',
      description: 'Get personalized trip recommendations based on your interests, budget, and travel style. Our AI-powered system suggests the best destinations, attractions, and activities tailored just for you.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
        </svg>
      ),
      title: 'Day-by-Day Itinerary',
      description: 'Create detailed, hour-by-hour itineraries for your entire trip. Drag and drop activities, adjust timings, and customize your schedule with ease. See your entire journey at a glance.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      title: 'Real-Time Place Data',
      description: 'Access real-time information about attractions, restaurants, cafes, and hotels. Get actual place names, ratings, and locations from trusted sources to make informed decisions.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
          <path d="M8 12h4.5" />
          <circle cx="16.5" cy="12" r="1.4" />
        </svg>
      ),
      title: 'Budget Management',
      description: 'Set your budget range and get recommendations that fit your comfort zone. Track estimated costs for your entire trip and make adjustments to stay within your budget.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
          <path d="M3.27 6.96L12 12.01l8.73-5.05" />
          <path d="M12 22.08V12" />
        </svg>
      ),
      title: 'Interactive Maps',
      description: 'Visualize your entire trip on an interactive map. See all your planned activities, restaurants, and accommodations in one place. Optimize your route and discover nearby attractions.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: 'Save & Share Plans',
      description: 'Save your trip plans to access them anytime. Share your itineraries with friends and family. Export your plans as PDF for offline access during your travels.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          <path d="M13 8H7M17 12H7" />
        </svg>
      ),
      title: 'AI Travel Assistant',
      description: 'Get instant help from our travel chatbot. Ask questions about destinations, get packing suggestions, weather insights, and travel tips. Our AI assistant is available 24/7.'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7h11l-2-2" />
          <path d="M7 7l2-2" />
          <path d="M17 17H6l2 2" />
          <path d="M17 17l-2 2" />
          <path d="M5 11.5a6.5 6.5 0 0112-3" />
          <path d="M19 12.5a6.5 6.5 0 01-12 3" />
        </svg>
      ),
      title: 'Cloud Sync',
      description: 'Access your trip plans from any device, anywhere. Your plans are automatically synced across desktop, tablet, and mobile. Never lose your itinerary again.'
    }
  ];

  const stats = [
    {
      value: '12k+',
      label: 'Trips Planned',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 16.5l20-9" />
          <path d="M3.5 20l3.5-2.5L7 13l5-4 3 3 4-2" />
        </svg>
      )
    },
    {
      value: '140+',
      label: 'Cities Covered',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 21V9l4-2 4 2v12" />
          <path d="M14 21V5l3-1 3 1v16" />
        </svg>
      )
    },
    {
      value: '6 hrs',
      label: 'Time Saved',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="7" />
          <path d="M12 9v4l2.5 1.5" />
        </svg>
      )
    },
    {
      value: '4.9★',
      label: 'User Rating',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader 
        onBack={onBack} 
        onDashboard={onDashboard} 
        title="About GoPlanner"
        subtitle="Your ultimate travel planning companion"
      />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2 mb-4">
            <span className="text-xs uppercase tracking-[0.4em] text-primary font-semibold">Welcome to GoPlanner</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white">
            Plan Your Perfect Trip
            <br />
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-blue-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
            GoPlanner is a comprehensive travel planning platform that helps you create detailed, personalized itineraries for your dream destinations. Whether you're planning a weekend getaway or a month-long adventure, we've got you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button onClick={onStartPlanning} className="h-14 px-8 text-base shadow-primary/40">
              Start Planning Now
            </Button>
            <Button variant="secondary" onClick={onBack} className="h-14 px-8 text-base">
              Explore Features
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </section>

        {/* Mission Section */}
        <section className="glass-panel rounded-[40px] p-10 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-slate-700 dark:text-white/70 max-w-3xl mx-auto leading-relaxed">
              We believe that planning a trip should be as exciting as the trip itself. Our mission is to make travel planning effortless, enjoyable, and accessible to everyone. We combine cutting-edge technology with real-world travel insights to help you create unforgettable experiences.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-primary uppercase tracking-[0.4em] text-xs font-semibold">Powerful Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Everything You Need to Plan Your Trip</h2>
            <p className="text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
              Discover the tools and features that make GoPlanner the perfect companion for your travel adventures.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="space-y-8">
          <div className="text-center space-y-3">
            <p className="text-primary uppercase tracking-[0.4em] text-xs font-semibold">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">How GoPlanner Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Share Your Preferences',
                description: 'Tell us where you want to go, your travel dates, budget, and interests. Our system uses this information to create a personalized plan just for you.'
              },
              {
                step: '02',
                title: 'Get Your Itinerary',
                description: 'We generate a detailed day-by-day itinerary with real places, restaurants, and activities. Everything is automatically curated based on your preferences.'
              },
              {
                step: '03',
                title: 'Customize & Save',
                description: 'Edit, rearrange, and customize your itinerary. Add notes, change timings, and save your plan. Export as PDF or share with friends.'
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-panel rounded-[32px] p-8 space-y-4 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-black w-16 h-16">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-700 dark:text-white/70 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="glass-panel rounded-[40px] p-10 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Why Choose GoPlanner?</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: '✓',
                title: 'Real-Time Data',
                description: 'Get actual information about places, restaurants, and hotels from trusted sources. No fake or outdated data.'
              },
              {
                icon: '✓',
                title: 'Completely Free',
                description: 'All core features are free to use. Plan unlimited trips without any subscription or hidden fees.'
              },
              {
                icon: '✓',
                title: 'User-Friendly',
                description: 'Intuitive interface that makes trip planning simple and enjoyable. No learning curve required.'
              },
              {
                icon: '✓',
                title: 'Privacy First',
                description: 'Your data is secure and private. We never share your travel plans with third parties.'
              },
              {
                icon: '✓',
                title: 'Offline Access',
                description: 'Download your plans as PDF and access them offline during your travels, even without internet.'
              },
              {
                icon: '✓',
                title: 'Regular Updates',
                description: 'We continuously improve our platform with new features and better data sources based on user feedback.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold w-10 h-10 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-slate-700 dark:text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6">
          <div className="glass-panel rounded-[40px] p-12 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Ready to Plan Your Next Adventure?</h2>
            <p className="text-lg text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
              Join thousands of travelers who trust GoPlanner to create their perfect trip itineraries. Start planning today and turn your travel dreams into reality.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button onClick={onStartPlanning} className="h-14 px-10 text-base shadow-primary/40">
                Create Your First Plan
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

