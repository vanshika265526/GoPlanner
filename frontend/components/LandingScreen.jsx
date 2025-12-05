import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { AppFooter } from './AppFooter';

const StatTripsIcon = () => (
  <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 16.5l20-9" />
      <path d="M3.5 20l3.5-2.5L7 13l5-4 3 3 4-2" />
      <path d="M10 19.5l2-1.5" />
    </svg>
  </div>
);

const StatCitiesIcon = () => (
  <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 21V9l4-2 4 2v12" />
      <path d="M14 21V5l3-1 3 1v16" />
      <path d="M8 13h0.01M8 17h0.01M16.5 10.5h0.01M16.5 14.5h0.01" />
    </svg>
  </div>
);

const StatTimeIcon = () => (
  <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="7" />
      <path d="M12 9v4l2.5 1.5" />
    </svg>
  </div>
);

const FeaturePinIcon = () => (
  <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-2.5">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-5.1 6-10a6 6 0 10-12 0c0 4.9 6 10 6 10z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  </div>
);

const FeatureCalendarIcon = () => (
  <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-2.5">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
      <path d="M9 13.5h2M13 13.5h2M9 17h2" />
    </svg>
  </div>
);

const FeatureSyncIcon = () => (
  <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-2.5">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7h11l-2-2" />
      <path d="M7 7l2-2" />
      <path d="M17 17H6l2 2" />
      <path d="M17 17l-2 2" />
      <path d="M5 11.5a6.5 6.5 0 0112-3" />
      <path d="M19 12.5a6.5 6.5 0 01-12 3" />
    </svg>
  </div>
);

const FeatureBudgetIcon = () => (
  <div className="flex items-center justify-center rounded-2xl bg-primary/10 p-2.5">
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="M8 12h4.5" />
      <circle cx="16.5" cy="12" r="1.4" />
    </svg>
  </div>
);

const highlights = [
  { id: 'trips', label: 'Trips Planned', value: '12k+', detail: 'last 12 months' },
  { id: 'cities', label: 'Cities Covered', value: '140+', detail: 'across the globe' },
  { id: 'time', label: 'Avg. Time Saved', value: '6 hrs', detail: 'per itinerary' },
];

const features = [
  {
    id: 'pin',
    title: 'One-click inspiration',
    desc: 'Curated day-by-day ideas the moment you share a destination.',
  },
  {
    id: 'calendar',
    title: 'Drag-and-drop timeline',
    desc: 'A cinematic view of your trip that grows with every idea.',
  },
  {
    id: 'sync',
    title: 'Cloud synced everywhere',
    desc: 'Pick up right where you left off across desktop & mobile.',
  },
  {
    id: 'budget',
    title: 'Smart budgeting',
    desc: 'Instant cost guidance matched to your comfort zone.',
  },
];

const steps = [
  { title: 'Share your vibe', text: 'Tell GoPlanner how you travel—city energy, beach calm, foodie quests.' },
  { title: 'Watch AI curate', text: 'In seconds you get a cinematic schedule, complete with hidden gems.' },
  { title: 'Make it yours', text: 'Drag, drop, reorder, and invite friends in real time.' },
];

const inspirationCards = [
  {
    id: 'jaipur',
    title: 'Jaipur Heritage Escape',
    description:
      'A pocket-sized royal adventure through forts, palaces, local bazaars, and delicious Rajasthani flavors.',
    image:
      'https://plus.unsplash.com/premium_photo-1697730373328-26e408d64025?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'ooty',
    title: 'Ooty Green Retreat',
    description: 'Tea estates, toy train rides, misty forests, cozy cafes.',
    image:
      'https://images.unsplash.com/photo-1660918738010-295b09857f93?q=80&w=402&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'maldives',
    title: 'Maldives Crystal Escape',
    description: 'Overwater villas, snorkeling, hammock naps, turquoise dreamland.',
    image:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 'paris',
    title: 'Paris Love Loop',
    description:
      'Eiffel sparkles lighting up the night, world-class museums, cozy street cafés, buttery pastries, and a slow, golden river.',
    image:
      'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

export const LandingScreen = ({ onStartPlanning, onViewSamplePlan, onOpenAuth, onOpenDashboard, onSavedPlans, onStartPlanningWithPrefill, onAboutUs, onContactUs }) => {
  const { user, isAuthenticated } = useAuth();
  const aboutRef = useRef(null);
  const inspirationRef = useRef(null);
  const samplePlansRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToRef = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleScrollHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSampleOpen = (planId) => {
    if (onViewSamplePlan) {
      onViewSamplePlan(planId);
    }
  };

  const handleAboutUsClick = () => {
    if (onAboutUs) {
      onAboutUs();
    } else {
      scrollToRef(aboutRef);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-light text-slate-900 dark:bg-[#020617] dark:text-slate-100 transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-6 sm:px-10 pt-10 pb-24 lg:pb-32">
          <div className="flex items-center justify-between gap-6 text-slate-700 dark:text-white/80 text-sm transition-colors">
            <div className="flex items-center gap-3 font-semibold tracking-tight text-slate-900 dark:text-white">
              <div className="flex items-center justify-center rounded-3xl bg-white/70 text-primary dark:bg-primary/15 p-3.5 pulse-ring shadow-lg shadow-primary/20 dark:shadow-primary/30 transition-colors">
                <svg
                  viewBox="0 0 32 32"
                  className="w-9 h-9 text-primary"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* outer ring */}
                  <circle cx="16" cy="16" r="10" />
                  {/* inner ring */}
                  <circle cx="16" cy="16" r="4.2" />
                  {/* N / S ticks */}
                  <path d="M16 4.5v2.2M16 25.3v-2.2" />
                  {/* compass needle */}
                  <path d="M12.2 19.8l2.2-6.2 6.2-2.2-2.2 6.2-6.2 2.2z" />
                  {/* subtle travel arc */}
                  <path d="M8.5 10.5a7.5 7.5 0 019-3" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl sm:text-[1.7rem] font-black tracking-tight">
                  <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 dark:from-blue-200 dark:via-cyan-200 dark:to-white bg-clip-text text-transparent drop-shadow-sm">
                    Go
                  </span>
                  <span className="ml-1 text-slate-900 dark:text-white">
                    Planner
                  </span>
                </span>
                <span className="mt-0.5 text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.4em] text-slate-400 dark:text-white/40">
                  Trip planner
                </span>
              </div>
            </div>

            {/* Center nav */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
              <button
                className="text-slate-900 dark:text-white relative after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-6 after:-translate-x-1/2 after:rounded-full after:bg-primary"
                onClick={handleScrollHome}
              >
                Home
              </button>
              <button
                className="text-slate-500 hover:text-primary dark:text-white/60 dark:hover:text-primary transition-colors"
                onClick={handleAboutUsClick}
              >
                About us
              </button>
              <button
                className="text-slate-500 hover:text-primary dark:text-white/60 dark:hover:text-primary transition-colors"
                onClick={() => scrollToRef(samplePlansRef)}
              >
                Sample Plans
              </button>
              <button
                className="text-slate-500 hover:text-primary dark:text-white/60 dark:hover:text-primary transition-colors"
                onClick={() => onContactUs?.()}
              >
                Contact Us
              </button>
              {isAuthenticated && (
                <button
                  className="text-slate-500 hover:text-primary dark:text-white/60 dark:hover:text-primary transition-colors"
                  onClick={() => onSavedPlans?.()}
                >
                  Saved Plans
                </button>
              )}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-[0.68rem] uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
                  Planner · v1.0
                </span>
                {isAuthenticated && user ? (
                  <Button
                    variant="primary"
                    className="h-9 px-4 text-xs font-semibold shadow-primary/40"
                    onClick={onOpenDashboard}
                  >
                    Welcome, {user.displayName || user.name || user.email?.split('@')[0] || 'User'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="h-9 px-4 text-xs font-semibold shadow-primary/40"
                    onClick={onOpenAuth || onStartPlanning}
                  >
                    Get Started
                  </Button>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="space-y-8 animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-white/20 bg-white/80 dark:bg-white/5 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm shadow-slate-200/60 dark:shadow-none transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3.5" y="5" width="17" height="15" rx="2" />
                  <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
                </svg>
                Plan your whole trip in one place
              </p>
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                Plan louder, dream bigger, travel{" "}
                <span className="text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 dark:from-blue-200 dark:via-cyan-200 dark:to-white bg-clip-text animate-shimmer">
                  smarter.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-700 dark:text-white/80 max-w-2xl">
                GoPlanner turns vague ideas into cinematic routes—complete with energy-matched restaurants,
                sunrise reminders, and hidden detours.
                <br/><br/> All personalized from your first tap.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated && user ? (
                  <Button onClick={onStartPlanning} className="shadow-primary/40 text-base h-16 px-10">
                    Start Planning
                  </Button>
                ) : (
                  <Button onClick={onOpenAuth || onStartPlanning} className="shadow-primary/40 text-base h-16 px-10">
                    Get Started
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => handleSampleOpen('jaipur')}
                  className="h-16 px-10 bg-white/90 text-slate-800 hover:bg-white shadow-md shadow-slate-300/60 border border-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border-white/20"
                >
                  View sample plan
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {highlights.map((item, idx) => (
                  <div key={item.label} className={`glass-panel rounded-2xl p-4 ${idx > 0 ? 'animate-delayed-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-2 text-slate-700 dark:text-white/80">
                      {item.id === 'trips' && <StatTripsIcon />}
                      {item.id === 'cities' && <StatCitiesIcon />}
                      {item.id === 'time' && <StatTimeIcon />}
                      <span className="text-sm uppercase tracking-widest text-slate-500 dark:text-white/60">{item.label}</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
                    <p className="text-sm text-slate-500 dark:text-white/60">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 -top-6 size-24 bg-primary/40 blur-3xl rounded-full animate-float" aria-hidden />
              <div className="glass-panel tilt-card rounded-[32px] p-8 space-y-6 animate-float">
                <div className="flex items-center justify-between text-sm text-slate-700 dark:text-white/70 transition-colors">
                  <span>Jaipur Vibes • 3 days</span>
                  <button
                    onClick={() => {
                      onStartPlanningWithPrefill?.({
                        destination: 'Jaipur',
                        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
                        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now (3 days trip)
                        budget: 'Mid',
                        interests: ['heritage', 'culture', 'history'],
                      });
                    }}
                    className="flex items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white w-8 h-8 transition-colors hover:bg-primary hover:text-white dark:hover:bg-primary"
                    title="Create this plan"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 12h12" />
                      <path d="M12 6v12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  {['Sunrise at Amber Fort', 'Heritage walk in Old City', 'Evening at Hawa Mahal'].map((entry, i) => (
                    <div key={entry} className="rounded-2xl bg-white/90 border border-slate-200 dark:bg-white/5 dark:border-white/10 px-4 py-3 transition-colors">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/40">Day {i + 1}</p>
                      <p className="font-semibold text-slate-900 dark:text-white">{entry}</p>
                      <p className="text-sm text-slate-600 dark:text-white/60">Auto-curated + editable</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-primary-dark to-primary px-5 py-4 flex items-center justify-between text-sm font-semibold">
                  <div>
                    <p className="text-white/70 text-xs uppercase tracking-[0.3em]">Budget Mode</p>
                    <p>Balanced · ₹15k estimate</p>
                  </div>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 17l5-5 4 4 7-8" />
                    <path d="M4 11V7h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-20 px-6 sm:px-10 pb-24">
          <section ref={aboutRef} className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-3 text-center">
              <p className="text-primary uppercase tracking-[0.4em] text-xs">Built for travel maximalists</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Why GoPlanner feels bigger</h2>
              <p className="text-slate-600 dark:text-white/70 max-w-2xl mx-auto">
                More canvas, more control, more magic. Every pixel stretches to spotlight the next story you’ll tell.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((item, idx) => (
                <div
                  key={item.title}
                  className="glass-panel rounded-3xl p-6 flex flex-col gap-4 tilt-card animate-fade-up"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                    <div className="flex items-center gap-3 text-primary">
                    {item.id === 'pin' && <FeaturePinIcon />}
                    {item.id === 'calendar' && <FeatureCalendarIcon />}
                    {item.id === 'sync' && <FeatureSyncIcon />}
                    {item.id === 'budget' && <FeatureBudgetIcon />}
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-400 dark:text-white/40">Feature {idx + 1}</p>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-700 dark:text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section ref={inspirationRef} className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">Three steps</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">A cinematic planner that grows with your energy</h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.title} className="glass-panel rounded-3xl p-5 flex gap-4 items-start">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-lg">
                      0{index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h3>
                      <p className="text-slate-700 dark:text-white/70">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent blur-3xl" aria-hidden />
              <div className="glass-panel rounded-[40px] p-8 space-y-6 tilt-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">Export & Share</p>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-xs font-semibold transition-colors">Available</span>
                </div>
                <div className="rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col gap-6">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-white/60 mb-4">Download your plan</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center rounded-2xl bg-primary/20 p-3">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <path d="M7 10l5 5 5-5" />
                          <path d="M12 15V3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">PDF Download</p>
                        <p className="text-xs text-slate-600 dark:text-white/60">Save your itinerary offline</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center rounded-2xl bg-primary/20 p-3">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-6 h-6 text-primary"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="18" cy="5" r="3" />
                          <circle cx="6" cy="12" r="3" />
                          <circle cx="18" cy="19" r="3" />
                          <path d="M8.59 13.51l6.83 3.98" />
                          <path d="M15.41 6.51l-6.82 3.98" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Share Instantly</p>
                        <p className="text-xs text-slate-600 dark:text-white/60">Share with friends via Web Share API</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between text-sm text-slate-700 dark:text-white/70">
                      <p>Download your complete itinerary as PDF or share it instantly with friends and family.</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-green-400 to-emerald-300" />
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-400 dark:text-white/40">100% Free • No Limits</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section ref={samplePlansRef} className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-primary uppercase tracking-[0.35em] text-xs">Destination energy</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Sample Plans, super-sized</h2>
              <p className="text-slate-600 dark:text-white/70">Hover to preview the vibe—each tile reacts with motion & light.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {inspirationCards.map((card) => (
                <button
                  key={card.id}
                  className="relative overflow-hidden rounded-3xl aspect-[4/5] group tilt-card text-left transition-transform"
                  onClick={() => handleSampleOpen(card.id)}
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-6 space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">Curated idea</p>
                    <h3 className="text-2xl text-white font-bold">{card.title}</h3>
                    <p className="text-white/70">{card.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.35em] text-primary">
                      View plan
                      <span className="material-symbols-outlined text-sm">north_east</span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>  
        </main>

        <div ref={contactRef}>
          <AppFooter />
        </div>
      </div>
    </div>
  );
};