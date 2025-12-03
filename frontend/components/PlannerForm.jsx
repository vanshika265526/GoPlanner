import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from './Button';
import { Input } from './Input';
import { ThemeToggle } from './ThemeToggle';
import { PageHeader } from './PageHeader';
import { generateRealItinerary } from '../services/placesService';
import { ItineraryMap } from './ItineraryMap';

// Beautiful travel destination images from different cities and countries
const TRAVEL_BACKGROUNDS = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', location: 'Santorini, Greece' },
  { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&q=80', location: 'Bali, Indonesia' },
  { url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80', location: 'Paris, France' },
  { url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1920&q=80', location: 'Tokyo, Japan' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', location: 'Maldives' },
  { url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80', location: 'Dubai, UAE' },
  { url: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1920&q=80', location: 'New York, USA' },
  { url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1920&q=80', location: 'London, UK' },
  { url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=80', location: 'Swiss Alps' },
  { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=80', location: 'Bora Bora' },
  { url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1920&q=80', location: 'Venice, Italy' },
  { url: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1920&q=80', location: 'Amsterdam, Netherlands' },
];

// Popular travel destinations for autocomplete
const POPULAR_DESTINATIONS = [
  'Jaipur, India', 'Ooty, India', 'Maldives', 'Paris, France', 'Tokyo, Japan',
  'Bali, Indonesia', 'Santorini, Greece', 'Dubai, UAE', 'New York, USA', 'London, UK',
  'Venice, Italy', 'Amsterdam, Netherlands', 'Barcelona, Spain', 'Rome, Italy', 'Bangkok, Thailand',
  'Singapore', 'Sydney, Australia', 'Mumbai, India', 'Delhi, India', 'Goa, India',
  'Manali, India', 'Shimla, India', 'Darjeeling, India', 'Kerala, India', 'Rajasthan, India',
  'Swiss Alps, Switzerland', 'Bora Bora, French Polynesia', 'Seychelles', 'Mauritius',
  'Phuket, Thailand', 'Hong Kong', 'Seoul, South Korea', 'Kyoto, Japan', 'Istanbul, Turkey',
  'Cairo, Egypt', 'Marrakech, Morocco', 'Lisbon, Portugal', 'Prague, Czech Republic',
  'Vienna, Austria', 'Berlin, Germany', 'Copenhagen, Denmark', 'Stockholm, Sweden',
  'Oslo, Norway', 'Reykjavik, Iceland', 'Edinburgh, Scotland', 'Dublin, Ireland',
];

const BUDGET_OPTIONS = ['Low', 'Mid', 'High'];
const TRAVEL_INTERESTS = [
  'Nature', 'Beaches', 'Temples', 'Shopping', 'Adventure', 
  'History', 'Food', 'Art', 'Nightlife', 'Relaxation'
];

// Generate simple itinerary based on form data
const generateSimpleItinerary = (formData) => {
  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const itinerary = [];

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayNumber = i + 1;
    
    const dayActivities = [];
    
    if (i === 0) {
      // Day 1: Check-in
      dayActivities.push({
        id: `${dayNumber}-1`,
        time: '12:00 PM',
        activity: 'Check-in at hotel',
        notes: '',
        order: 1,
      });
      
      if (formData.interests.includes('Temples')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '2:00 PM',
          activity: 'Visit local temple',
          notes: '',
          order: 2,
        });
      } else if (formData.interests.includes('Beaches')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '2:00 PM',
          activity: 'Visit beach',
          notes: '',
          order: 2,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '2:00 PM',
          activity: 'Explore local area',
          notes: '',
          order: 2,
        });
      }
      
      dayActivities.push({
        id: `${dayNumber}-3`,
        time: '7:00 PM',
        activity: 'Dinner recommendation',
        notes: 'Try local cuisine',
        order: 3,
      });
    } else if (i === days - 1) {
      // Last day: Checkout
      dayActivities.push({
        id: `${dayNumber}-1`,
        time: '9:00 AM',
        activity: 'Breakfast',
        notes: '',
        order: 1,
      });
      
      if (formData.interests.includes('Shopping')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Shopping',
          notes: 'Buy souvenirs',
          order: 2,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Last minute exploration',
          notes: '',
          order: 2,
        });
      }
      
      dayActivities.push({
        id: `${dayNumber}-3`,
        time: '12:00 PM',
        activity: 'Checkout',
        notes: '',
        order: 3,
      });
    } else {
      // Middle days
      dayActivities.push({
        id: `${dayNumber}-1`,
        time: '9:00 AM',
        activity: 'Breakfast',
        notes: '',
        order: 1,
      });
      
      if (formData.interests.includes('Nature')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Visit nature spot',
          notes: '',
          order: 2,
        });
      } else if (formData.interests.includes('History')) {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Visit historical place',
          notes: '',
          order: 2,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-2`,
          time: '10:00 AM',
          activity: 'Visit popular attraction',
          notes: '',
          order: 2,
        });
      }
      
      dayActivities.push({
        id: `${dayNumber}-3`,
        time: '2:00 PM',
        activity: 'Lunch break',
        notes: '',
        order: 3,
      });
      
      if (formData.interests.includes('Adventure')) {
        dayActivities.push({
          id: `${dayNumber}-4`,
          time: '4:00 PM',
          activity: 'Adventure activity',
          notes: '',
          order: 4,
        });
      } else {
        dayActivities.push({
          id: `${dayNumber}-4`,
          time: '4:00 PM',
          activity: 'Visit another attraction',
          notes: '',
          order: 4,
        });
      }
      
      dayActivities.push({
        id: `${dayNumber}-5`,
        time: '6:00 PM',
        activity: 'Sunset point',
        notes: '',
        order: 5,
      });
    }
    
    itinerary.push({
      dayNumber,
      date: currentDate.toISOString().split('T')[0],
      activities: dayActivities,
    });
  }
  
  return itinerary;
};

export const PlannerForm = ({ onSubmit, onCancel, initialData = null, onBack, onDashboard }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: initialData?.destination || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || 'Mid',
    interests: initialData?.interests || [],
  });
  const [itinerary, setItinerary] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itineraryCoordinates, setItineraryCoordinates] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Auto-transition between travel destination images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackgroundIndex((prev) => (prev + 1) % TRAVEL_BACKGROUNDS.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        destination: initialData.destination || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        budget: initialData.budget || 'Mid',
        interests: initialData.interests || [],
      });
      // If we have initial data, we can auto-advance to step 2 if itinerary exists
      // But for now, let's keep it at step 1 so user can review and regenerate
    }
  }, [initialData]);

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleDestinationChange = (value) => {
    setFormData(prev => ({ ...prev, destination: value }));
    
    if (value.length > 0) {
      const filtered = POPULAR_DESTINATIONS.filter(dest =>
        dest.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8); // Show max 8 suggestions
      setDestinationSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setDestinationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleDestinationSelect = (destination) => {
    setFormData(prev => ({ ...prev, destination }));
    setShowSuggestions(false);
    setDestinationSuggestions([]);
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    if (formData.destination && formData.startDate && formData.endDate) {
      setIsLoading(true);
      console.log('Starting itinerary generation for:', formData);
      
      try {
        // Try to generate real itinerary with APIs
        console.log('Calling backend API for itinerary generation...');
        const realItineraryData = await generateRealItinerary(formData);
        console.log('Backend API response:', realItineraryData);
        
        if (realItineraryData && realItineraryData.itinerary && realItineraryData.itinerary.length > 0) {
          console.log('✅ Setting itinerary with', realItineraryData.itinerary.length, 'days');
          console.log('✅ Coordinates:', realItineraryData.coordinates);
          
          // Count activities with coordinates for debugging
          const totalActivities = realItineraryData.itinerary.reduce((sum, day) => sum + day.activities.length, 0);
          const activitiesWithCoords = realItineraryData.itinerary.reduce((sum, day) => 
            sum + day.activities.filter(a => a.coordinates && a.coordinates.lat && a.coordinates.lng).length, 0
          );
          console.log(`✅ Activities: ${totalActivities} total, ${activitiesWithCoords} with coordinates`);
          
          setItinerary(realItineraryData.itinerary);
          setItineraryCoordinates(realItineraryData.coordinates);
          setIsLoading(false);
          setHasAnimated(false); // Reset animation flag when new itinerary is set
          setStep(2);
        } else {
          console.warn('❌ Real itinerary generation returned empty, using simple itinerary');
          // Fallback to simple itinerary if APIs fail
          const generated = generateSimpleItinerary(formData);
          console.log('Using simple itinerary:', generated);
          setItinerary(generated);
          setIsLoading(false);
          setHasAnimated(false); // Reset animation flag when new itinerary is set
          setStep(2);
        }
      } catch (error) {
        console.error('❌ Error generating itinerary:', error);
        console.error('Error details:', error.message, error.stack);
        // Fallback to simple itinerary on error
        const generated = generateSimpleItinerary(formData);
        console.log('Using fallback simple itinerary:', generated);
        setItinerary(generated);
        setIsLoading(false);
        setHasAnimated(false); // Reset animation flag when new itinerary is set
        setStep(2);
      }
    } else {
      console.warn('Form validation failed:', formData);
    }
  };

  // Step 3 is now merged into Step 2, so this function is no longer needed
  // const handleStep2Continue = () => {
  //   setStep(3);
  // };

  const handleAddActivity = (dayNumber) => {
    const newActivity = {
      id: `${dayNumber}-${Date.now()}`,
      time: '12:00 PM',
      activity: 'New activity',
      notes: '',
      order: itinerary.find(d => d.dayNumber === dayNumber).activities.length + 1,
    };
    
    setItinerary(prev => prev.map(day => 
      day.dayNumber === dayNumber
        ? { ...day, activities: [...day.activities, newActivity] }
        : day
    ));
    setEditingActivity(newActivity.id);
  };

  const handleRemoveActivity = (dayNumber, activityId) => {
    setItinerary(prev => prev.map(day => 
      day.dayNumber === dayNumber
        ? { ...day, activities: day.activities.filter(a => a.id !== activityId) }
        : day
    ));
  };

  const handleUpdateActivity = (dayNumber, activityId, field, value) => {
    setItinerary(prev => prev.map(day => 
      day.dayNumber === dayNumber
        ? {
            ...day,
            activities: day.activities.map(a =>
              a.id === activityId ? { ...a, [field]: value } : a
            )
          }
        : day
    ));
  };

  const handleReorderActivity = (dayNumber, activityId, direction) => {
    setItinerary(prev => prev.map(day => {
      if (day.dayNumber !== dayNumber) return day;
      
      const activities = [...day.activities];
      const index = activities.findIndex(a => a.id === activityId);
      if (index === -1) return day;
      
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= activities.length) return day;
      
      [activities[index], activities[newIndex]] = [activities[newIndex], activities[index]];
      
      // Update order
      activities.forEach((a, idx) => {
        a.order = idx + 1;
      });
      
      return { ...day, activities };
    }));
  };

  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    // Find which day contains the dragged activity
    const dayIndex = itinerary.findIndex(day => 
      day.activities.some(act => act.id === active.id)
    );
    
    if (dayIndex === -1) return;
    
    const day = itinerary[dayIndex];
    const oldIndex = day.activities.findIndex(act => act.id === active.id);
    const newIndex = day.activities.findIndex(act => act.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    setItinerary(prev => prev.map((d, idx) => {
      if (idx !== dayIndex) return d;
      
      const newActivities = arrayMove(d.activities, oldIndex, newIndex);
      // Update order
      newActivities.forEach((a, i) => {
        a.order = i + 1;
      });
      
      return { ...d, activities: newActivities };
    }));
  };

  // Mark animation as complete after initial render
  useEffect(() => {
    if (step === 2 && itinerary && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true);
      }, 2000); // Wait for all animations to complete (max delay + duration)
      return () => clearTimeout(timer);
    }
  }, [step, itinerary, hasAnimated]);

  // Sortable Activity Card Component
  const SortableActivityCard = ({ activity, day, dayNumber, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: activity.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? transition : undefined, // Only use transition during drag
      opacity: isDragging ? 0.5 : 1,
    };

    // Only animate on initial render when step 2 is first shown
    const mergedStyle = {
      ...style,
      ...(step === 2 && !hasAnimated && {
        animation: `fadeUp 0.5s ease-out ${index * 0.1}s both`
      })
    };

    return (
      <div
        ref={setNodeRef}
        style={mergedStyle}
        className={`group relative bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-grab active:cursor-grabbing ${
          editingActivity === activity.id ? 'ring-2 ring-primary' : ''
        } ${isDragging ? 'z-50 shadow-2xl' : ''}`}
      >
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-lg">drag_handle</span>
          </div>
          
          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-xl">
              {activity.type === 'dining' ? 'restaurant' : 
               activity.type === 'sightseeing' ? 'camera' : 
               activity.type === 'accommodation' ? 'hotel' : 
               'place'}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {editingActivity === activity.id ? (
                  <div className="space-y-2">
                    <input
                      type="time"
                      value={activity.time}
                      onChange={(e) => handleUpdateActivity(dayNumber, activity.id, 'time', e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm"
                    />
                    <input
                      type="text"
                      value={activity.activity}
                      onChange={(e) => handleUpdateActivity(dayNumber, activity.id, 'activity', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-medium"
                    />
                    <textarea
                      value={activity.notes || ''}
                      onChange={(e) => handleUpdateActivity(dayNumber, activity.id, 'notes', e.target.value)}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm resize-none"
                      rows={2}
                      placeholder="Add notes..."
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">{activity.time}</span>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {activity.activity}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {activity.type === 'dining' ? 'Food' : 
                         activity.type === 'sightseeing' ? 'Sightseeing' : 
                         activity.type === 'accommodation' ? 'Accommodation' : 
                         activity.type}
                      </span>
                      {activity.rating && activity.rating !== 'N/A' && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ⭐ {activity.rating}
                        </span>
                      )}
                    </div>
                    {activity.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {activity.notes}
                      </p>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingActivity === activity.id ? (
                  <button
                    onClick={() => setEditingActivity(null)}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">check</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingActivity(activity.id)}
                    className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                )}
                <button
                  onClick={() => handleRemoveActivity(dayNumber, activity.id)}
                  className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSave = () => {
    if (onSubmit) {
      onSubmit({
        ...formData,
        itinerary,
      });
    }
  };

  // Get all activities for map (must be before conditional returns)
  const allActivities = useMemo(() => {
    if (!itinerary) return [];
    return itinerary.flatMap(day => day.activities);
  }, [itinerary]);

  // Calculate budget (placeholder - can be enhanced)
  const estimatedBudget = useMemo(() => {
    // Simple calculation based on activities
    return allActivities.length * 50; // $50 per activity as placeholder
  }, [allActivities]);

  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white px-6 py-12 overflow-hidden transition-colors flex items-center justify-center">
        <div className="text-center space-y-6 z-10">
          <div className="relative size-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">flight</span>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generating your itinerary...</h2>
            <p className="text-slate-600 dark:text-slate-400">Fetching real places, cafes, and attractions for {formData.destination || 'your destination'}...</p>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Create Trip
  if (step === 1) {
  return (
    <div className="relative min-h-screen bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white px-6 py-12 overflow-hidden transition-colors">
        {/* Beautiful Travel Places Background Slideshow */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          {TRAVEL_BACKGROUNDS.map((bg, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentBackgroundIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${bg.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
          ))}
          {/* Soft overlay for peaceful, readable background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50/70 via-white/60 to-blue-50/50 dark:from-slate-900/85 dark:via-slate-800/75 dark:to-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent dark:from-slate-900/60" />
        </div>
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-slate-700 hover:text-slate-900 dark:text-white/70 dark:hover:text-white text-sm uppercase tracking-[0.4em] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Home
          </button>
          <ThemeToggle />
        </div>

          <form onSubmit={handleStep1Submit} className="glass-panel rounded-[32px] p-8 space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white">Create Trip</h1>
              <p className="text-slate-600 dark:text-white/70">Fill in the details to get started with your trip planning.</p>
            </div>

            <div className="space-y-6">
              <div className="relative">
              <Input
                  label="Where are you going? (Destination)"
                  placeholder="e.g. Jaipur, Ooty, Maldives, Paris"
                  icon="location_on"
                value={formData.destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  onFocus={() => {
                    if (formData.destination.length > 0) {
                      handleDestinationChange(formData.destination);
                    }
                  }}
                  onBlur={(e) => {
                    // Delay hiding suggestions to allow click on dropdown items
                    const relatedTarget = e.relatedTarget;
                    if (!relatedTarget || !relatedTarget.closest('.destination-dropdown')) {
                      setTimeout(() => setShowSuggestions(false), 200);
                    }
                  }}
                required
              />
                {/* Autocomplete Dropdown */}
                {showSuggestions && destinationSuggestions.length > 0 && (
                  <div className="destination-dropdown absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-white/10 shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                    {destinationSuggestions.map((dest, index) => (
                      <button
                        key={index}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent input blur
                          handleDestinationSelect(dest);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-white/5 last:border-b-0"
                      >
                        <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                        <span className="text-slate-900 dark:text-white font-medium">{dest}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Start date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <Input
                  label="End date"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-white/80">
                  Budget range
                  </label>
                  <select
                    className="block w-full rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-white/5 py-3.5 pl-4 pr-10 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary text-base"
                    value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                >
                  {BUDGET_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                  </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-white/80">
                  Travel interests (select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {TRAVEL_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                        formData.interests.includes(interest)
                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/40'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400 dark:border-white/20 dark:text-white/70 dark:hover:border-white/50'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              icon="arrow_forward" 
              fullWidth 
              className="h-16 text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Fetching Real Places...' : 'Generate Itinerary'}
            </Button>
          </form>
        </div>
                  </div>
    );
  }

  // Step 2: Generated Itinerary with Map and Inline Editing
  if (step === 2) {
    if (!itinerary || itinerary.length === 0) {
      return (
        <div className="relative min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-slate-600 dark:text-slate-400">No itinerary data available. Please go back and generate an itinerary.</p>
            <Button onClick={() => setStep(1)}>Back to Form</Button>
              </div>
            </div>
      );
    }
    
    const currentDay = selectedDay || itinerary?.[0];
    
    return (
      <div className="relative min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors">
        <PageHeader
          onBack={() => setStep(1)}
          onDashboard={onDashboard}
          title={formData.destination || 'My Trip'}
          subtitle={formData.startDate && formData.endDate
            ? `${new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : 'Dates not specified'}
        />
        
        {/* Additional info bar below header */}
        <div className="sticky top-[73px] z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Budget: ${estimatedBudget}
                </span>
              </div>
              <Button
                variant="secondary"
                className="h-9 px-4 text-sm"
              >
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Split View */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
            {/* Left Panel - Itinerary Cards */}
            <div className="overflow-y-auto pr-2 space-y-6">
              {itinerary?.map((day) => (
                <div key={day.dayNumber} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {day.activities.length} STOPS
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleAddActivity(day.dayNumber)}
                      className="h-8 px-3 text-xs"
                      icon="add"
                    >
                      Add Activity
                    </Button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={() => {
                      // Disable animation during drag to prevent re-animation
                      if (!hasAnimated) setHasAnimated(true);
                    }}
                  >
                    <SortableContext
                      items={day.activities.map(a => a.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {day.activities.map((activity, idx) => (
                          <SortableActivityCard
                            key={activity.id}
                            activity={activity}
                            day={day}
                            dayNumber={day.dayNumber}
                            index={idx}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              ))}
              
              <button
                onClick={() => {
                  const lastDay = itinerary?.[itinerary.length - 1];
                  if (lastDay) handleAddActivity(lastDay.dayNumber);
                }}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined mr-2">add</span>
                Add Activity
              </button>
            </div>

            {/* Right Panel - Map */}
            <div className="sticky top-0 h-full">
              <ItineraryMap
                activities={allActivities}
                destination={formData.destination}
                coordinates={itineraryCoordinates}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                onClick={() => setStep(1)}
                className="h-12 px-6"
              >
                Back
              </Button>
              <Button
                onClick={handleSave}
                className="h-12 px-6"
                icon="save"
              >
                Save Itinerary
              </Button>
            </div>
          </div>
      </div>
    </div>
  );
  }

  // Step 3 is now merged into Step 2 with inline editing
  // No separate Step 3 needed
};
