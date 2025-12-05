import React, { useEffect } from 'react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { AppFooter } from './AppFooter';
import { PageHeader } from './PageHeader';

const ActivityIcon = ({ type }) => {
  const icons = {
    food: 'restaurant',
    sightseeing: 'photo_camera',
    relaxation: 'self_improvement',
    adventure: 'paragliding',
    transport: 'flight',
    culture: 'museum',
    shopping: 'shopping_bag',
    nature: 'forest',
  };

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-200/80 dark:bg-white/10 border border-slate-300/50 dark:border-white/20">
      <span className="material-symbols-outlined text-2xl text-slate-700 dark:text-white">{icons[type] || 'star'}</span>
    </div>
  );
};

export const SamplePlanPage = ({ plan, onBack, onEdit, onDashboard }) => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Add class to body, html, and root to override min-height via CSS
    const body = document.body;
    const root = document.getElementById('root');
    const html = document.documentElement;
    
    // Add class to trigger CSS override
    body.classList.add('sample-plan-page');
    if (root) root.classList.add('sample-plan-page');
    html.classList.add('sample-plan-page');
    
    // Also set inline styles as backup
    body.style.setProperty('min-height', 'auto', 'important');
    body.style.setProperty('height', 'auto', 'important');
    
    if (root) {
      root.style.setProperty('min-height', 'auto', 'important');
      root.style.setProperty('height', 'auto', 'important');
    }
    
    html.style.setProperty('min-height', 'auto', 'important');
    html.style.setProperty('height', 'auto', 'important');
    
    return () => {
      // Remove classes
      body.classList.remove('sample-plan-page');
      if (root) root.classList.remove('sample-plan-page');
      html.classList.remove('sample-plan-page');
      
      // Remove inline styles
      body.style.removeProperty('min-height');
      body.style.removeProperty('height');
      if (root) {
        root.style.removeProperty('min-height');
        root.style.removeProperty('height');
      }
      html.style.removeProperty('min-height');
      html.style.removeProperty('height');
    };
  }, []);

  if (!plan) return null;

  return (
    <div className="relative bg-background-light text-slate-900 dark:bg-slate-900 dark:text-white transition-colors" style={{ height: 'fit-content', minHeight: 'auto' }}>
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <div className="relative z-10">
        <PageHeader
          onBack={onBack}
          onDashboard={onDashboard}
          title={plan.destination || 'Sample Plan'}
          subtitle="Sample Trip Plan"
        />

        <main className="px-6 sm:px-10 pb-0 space-y-12 max-w-7xl mx-auto" style={{ marginBottom: 0 }}>
          <section className="relative overflow-hidden rounded-[40px] border border-white/20 bg-white/70 dark:bg-white/5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(120deg, rgba(15,23,42,0.85), rgba(15,23,42,0.4)), url(${plan.heroImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="relative z-10 p-10 space-y-6 text-white">
              <p className="text-xs uppercase tracking-[0.45em] text-white/70">Curated Sample Plan</p>
              <div>
                <h1 className="text-4xl font-black tracking-tight">{plan.title}</h1>
                <p className="text-lg text-white/80">{plan.subtitle}</p>
              </div>
              <p className="max-w-3xl text-base text-white/80 leading-relaxed">{plan.summary}</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30" onClick={() => onEdit(plan)}>
                  Edit plan
                </Button>
                <Button className="bg-primary/90 hover:bg-primary" onClick={onBack} icon="home">
                  Back to home
                </Button>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="glass-panel rounded-[32px] p-8 space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">Highlights</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {plan.highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl bg-white/80 dark:bg-white/5 border border-white/10 p-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">Tips</p>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-white/70 list-disc list-inside">
                {plan.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-8">
            {plan.days.map((day) => (
              <div key={day.dayNumber} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-white/30 to-transparent" />
                  <span className="rounded-full border border-slate-300/50 dark:border-white/20 bg-white/60 dark:bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.4em] text-slate-700 dark:text-white/80">
                    Day {day.dayNumber} · {day.theme}
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/50 dark:via-white/30 to-transparent" />
                </div>
                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <div
                      key={`${activity.activity}-${activity.time}`}
                      className="glass-panel rounded-[28px] p-5 flex gap-5 items-start"
                    >
                      <ActivityIcon type={activity.type} />
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold">{activity.activity}</h3>
                          <span className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
                            {activity.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-white/70">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-white/60">
                          <span className="material-symbols-outlined text-base text-slate-600 dark:text-white/60">location_on</span>
                          {activity.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="glass-panel rounded-[32px] p-6 text-center space-y-4 mb-0">
            <p className="text-base text-slate-700 dark:text-white/70">
            Like it? As soon as you tap Edit Plan, all the details will pop right into the planner form—ready for you to tweak.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => onEdit(plan)} className="h-14 px-8" icon="edit_square">
                Edit this plan
              </Button>
              <Button variant="secondary" onClick={onBack} className="h-14 px-8">
                Back to inspirations
              </Button>
            </div>
          </section>
        </main>
      </div>
      
      <AppFooter />
    </div>
  );
};

