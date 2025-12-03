import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { PageHeader } from './PageHeader';

const ActivityIcon = ({ type }) => {
  const icons = {
    food: 'restaurant',
    sightseeing: 'photo_camera',
    relaxation: 'self_improvement',
    adventure: 'hiking',
    transport: 'directions_bus',
  };
  
  const colors = {
    food: 'text-orange-400 bg-orange-400/20',
    sightseeing: 'text-blue-400 bg-blue-400/20',
    relaxation: 'text-teal-300 bg-teal-300/20',
    adventure: 'text-red-400 bg-red-400/20',
    transport: 'text-gray-300 bg-gray-300/20',
  };

  return (
    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${colors[type] || colors.sightseeing}`}>
      <span className="material-symbols-outlined text-2xl">{icons[type] || 'circle'}</span>
    </div>
  );
};

const badgeStyles = ['from-blue-500/20', 'from-violet-500/20', 'from-emerald-500/20'];

export const ItineraryScreen = ({ itinerary, onBack, onDashboard, onEdit, onSave, onShare, onDownload, onHome }) => {
  const [plan, setPlan] = useState(itinerary);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPlan(itinerary);
  }, [itinerary]);

  const updateActivityField = (dayIndex, activityIndex, field, value) => {
    setPlan(prev => {
      const days = prev.days.map((day, i) => {
        if (i !== dayIndex) return day;
        const activities = day.activities.map((act, j) =>
          j === activityIndex ? { ...act, [field]: value } : act
        );
        return { ...day, activities };
      });
      return { ...prev, days };
    });
  };

  const deleteActivity = (dayIndex, activityIndex) => {
    setPlan(prev => {
      const days = prev.days.map((day, i) => {
        if (i !== dayIndex) return day;
        const activities = day.activities.filter((_, j) => j !== activityIndex);
        return { ...day, activities };
      });
      return { ...prev, days };
    });
  };

  const addActivity = (dayIndex) => {
    setPlan(prev => {
      const days = prev.days.map((day, i) => {
        if (i !== dayIndex) return day;
        const newActivity = {
          time: 'New time',
          activity: 'New activity',
          description: 'Activity details…',
          location: plan.destination,
          type: 'sightseeing',
        };
        return { ...day, activities: [...day.activities, newActivity] };
      });
      return { ...prev, days };
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-light text-slate-900 dark:bg-[#010817] dark:text-white pb-16 transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader
        onBack={onBack}
        onDashboard={onDashboard}
        title={itinerary.destination || 'My Trip'}
        subtitle={itinerary.startDate && itinerary.endDate 
          ? `${new Date(itinerary.startDate).toLocaleDateString()} - ${new Date(itinerary.endDate).toLocaleDateString()}`
          : 'Trip plan'}
      />
      
      {/* Action buttons bar */}
      <div className="sticky top-[73px] z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => onShare?.(plan)}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="Share plan"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">share</span>
            </button>
            <button 
              onClick={() => onDownload?.(plan)}
              className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
              title="Download as PDF"
            >
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">download</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-10 space-y-10">
        <section className="glass-panel rounded-[40px] p-8 space-y-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-white/50">Trip overview</p>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Energy snapshot</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[`${plan.days.length} days`, 'Planner view', plan.destination].map((pill, idx) => (
                <span
                  key={pill}
                  className={`rounded-full bg-gradient-to-r ${badgeStyles[idx % badgeStyles.length]} to-transparent border border-white/10 px-4 py-1 text-sm uppercase tracking-[0.35em]`}
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <p className="text-lg text-slate-700 dark:text-white/80 leading-relaxed">
            {plan.summary || `Your ${plan.days?.length || 0}-day trip to ${plan.destination || 'your destination'}. Budget: ${plan.budget || 'Mid'}.`}
          </p>
        </section>

        <section className="space-y-10">
          {plan.days.map((day, dayIndex) => (
            <div key={day.dayNumber} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
                <div className="px-6 py-2 rounded-full glass-panel text-sm font-semibold tracking-[0.35em] uppercase">
                  Day {day.dayNumber} · {day.theme}
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-white/40 to-transparent" />
              </div>

              <div className="space-y-5">
                {day.activities.map((activity, idx) => (
                  <div
                    key={`${activity.activity}-${idx}`}
                    className="glass-panel rounded-[32px] p-6 flex gap-5 tilt-card"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <input
                          className="bg-transparent text-2xl font-semibold border-b border-white/10 focus:outline-none focus:border-primary/60 min-w-[160px]"
                          value={activity.activity}
                          onChange={(e) =>
                            updateActivityField(dayIndex, idx, 'activity', e.target.value)
                          }
                        />
                        <input
                          className="px-3 py-1 rounded-full bg-white/10 text-xs uppercase tracking-[0.3em] border border-white/10 focus:outline-none focus:border-primary/60"
                          value={activity.time}
                          onChange={(e) =>
                            updateActivityField(dayIndex, idx, 'time', e.target.value)
                          }
                        />
                      </div>
                      <textarea
                        className="w-full bg-transparent text-sm text-slate-700 dark:text-white/70 leading-relaxed border border-white/10 rounded-2xl p-3 resize-none focus:outline-none focus:border-primary/60"
                        value={activity.description}
                        rows={2}
                        onChange={(e) =>
                          updateActivityField(dayIndex, idx, 'description', e.target.value)
                        }
                      />
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/60">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          <input
                            className="bg-transparent border-b border-white/10 focus:outline-none focus:border-primary/60 min-w-[120px]"
                            value={activity.location}
                            onChange={(e) =>
                              updateActivityField(dayIndex, idx, 'location', e.target.value)
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteActivity(dayIndex, idx)}
                          className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-red-300 hover:text-red-200"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-1 h-10 px-4 bg-white/5 hover:bg-white/10 text-xs uppercase tracking-[0.3em]"
                  onClick={() => addActivity(dayIndex)}
                >
                  <span className="material-symbols-outlined text-base mr-1">add</span>
                  Add activity
                </Button>
              </div>
            </div>
          ))}
        </section>

        <div className="glass-panel rounded-[32px] p-6 text-center space-y-4">
          <p className="text-slate-700 dark:text-white/70">This is your basic plan — you can go back to the planner to modify it.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => onEdit?.(itinerary)} 
              variant="secondary" 
              className="h-14 px-8 bg-white/10 hover:bg-white/20"
            >
              Edit this plan
            </Button>
            <Button 
              onClick={async () => {
                setIsSaving(true);
                try {
                  await onSave?.(plan);
                } finally {
                  setIsSaving(false);
                }
              }}
              variant="secondary"
              className="h-14 px-8 bg-white/10 hover:bg-white/20"
              isLoading={isSaving}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save plan'}
            </Button>
            <Button 
              onClick={() => onShare?.(plan)} 
              variant="secondary"
              className="h-14 px-8 bg-white/10 hover:bg-white/20"
              icon="share"
            >
              Share plan
            </Button>
            <Button 
              onClick={() => onHome?.()} 
              className="h-14 px-8" 
              icon="home"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};