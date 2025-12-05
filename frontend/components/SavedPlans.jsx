import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './Button';
import { PageHeader } from './PageHeader';
import { AppFooter } from './AppFooter';

export const SavedPlans = ({ onBack, onDashboard, onViewPlan, onEditPlan }) => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('goplanner_token');

      if (!token) {
        throw new Error('No authentication token found. Please sign in.');
      }

      console.log('Fetching saved plans from:', `${API_BASE_URL}/trips`);

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Saved plans result:', result);

      if (result.status === 'success') {
        setTrips(result.data?.trips || []);
      } else {
        throw new Error(result.message || 'Failed to fetch saved plans');
      }
    } catch (error) {
      console.error('Error fetching saved plans:', error);
      setError(error.message || 'Failed to load saved plans');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('SavedPlans component mounted, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      fetchSavedPlans();
    } else {
      setIsLoading(false);
      setError('Please sign in to view your saved plans.');
    }
  }, [isAuthenticated, fetchSavedPlans]);

  // Listen for refresh event
  useEffect(() => {
    const handleRefresh = () => {
      if (isAuthenticated) {
        fetchSavedPlans();
      }
    };

    window.addEventListener('refreshSavedPlans', handleRefresh);
    return () => {
      window.removeEventListener('refreshSavedPlans', handleRefresh);
    };
  }, [isAuthenticated, fetchSavedPlans]);

  // Debug: Log when component renders
  console.log('SavedPlans render - isLoading:', isLoading, 'error:', error, 'trips:', trips.length);


  const handleDeletePlan = async (tripId) => {
    if (!confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('goplanner_token');

      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Remove from local state
        setTrips(prev => prev.filter(trip => trip._id !== tripId));
      } else {
        throw new Error(result.message || 'Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan: ' + error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen flex flex-col overflow-hidden bg-background-light text-slate-900 dark:bg-slate-900 dark:text-white transition-colors">
        <div className="backdrop-grid" aria-hidden />
        <div className="aurora-layer" aria-hidden />
        <PageHeader onBack={onBack} onDashboard={onDashboard} title="Saved Plans" />
        <div className="relative z-10 flex-1 max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="glass-panel rounded-[40px] p-12 space-y-6">
            <span className="material-symbols-outlined text-6xl text-slate-400">lock</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
            <p className="text-slate-600 dark:text-slate-400">Please sign in to view your saved plans.</p>
          </div>
        </div>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background-light text-slate-900 dark:bg-slate-900 dark:text-white transition-colors">
      <div className="backdrop-grid" aria-hidden />
      <div className="aurora-layer" aria-hidden />

      <PageHeader 
        onBack={onBack} 
        onDashboard={onDashboard} 
        title="My Saved Plans"
        subtitle={trips.length > 0 ? `${trips.length} saved trip${trips.length !== 1 ? 's' : ''}` : 'Your saved trip plans'}
      />

      <div className="relative z-10 flex-1 max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block size-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading your saved plans...</p>
          </div>
        ) : error ? (
          <div className="glass-panel rounded-[32px] p-8 text-center space-y-4">
            <span className="material-symbols-outlined text-5xl text-red-400">error</span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Plans</h3>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
            <Button onClick={fetchSavedPlans} variant="secondary">Try Again</Button>
          </div>
        ) : trips.length === 0 ? (
          <div className="glass-panel rounded-[32px] p-12 text-center space-y-6">
            <span className="material-symbols-outlined text-6xl text-slate-400">bookmark_border</span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No Saved Plans Yet</h3>
            <p className="text-slate-600 dark:text-slate-400">Start planning your trips and save them to see them here!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => {
              const startDate = trip.startDate ? new Date(trip.startDate).toLocaleDateString() : '';
              const endDate = trip.endDate ? new Date(trip.endDate).toLocaleDateString() : '';
              const days = trip.itinerary?.length || 0;
              
              return (
                <div
                  key={trip._id}
                  className="glass-panel rounded-[32px] p-6 space-y-4 hover:scale-[1.02] transition-transform cursor-pointer group"
                  onClick={() => onViewPlan?.(trip)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                        {trip.destination || 'Untitled Trip'}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {startDate && endDate ? `${startDate} - ${endDate}` : 'Dates not set'}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlan(trip._id);
                      }}
                      className="size-8 rounded-full bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 flex items-center justify-center transition-colors"
                      title="Delete plan"
                    >
                      <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">delete</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      {days} {days === 1 ? 'day' : 'days'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">attach_money</span>
                      {trip.budget || 'Mid'}
                    </span>
                  </div>

                  {trip.interests && trip.interests.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {trip.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {trip.interests.length > 3 && (
                        <span className="px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs">
                          +{trip.interests.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="secondary"
                      className="flex-1 h-9 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewPlan?.(trip);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      className="flex-1 h-9 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPlan?.(trip);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}  
          </div>
        )}
      </div>
      
      <AppFooter />
    </div>
  );
};

