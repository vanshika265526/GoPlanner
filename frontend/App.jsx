import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingScreen } from './components/LandingScreen';
import { PlannerForm } from './components/PlannerForm';
import { ItineraryScreen } from './components/ItineraryScreen';
import { SamplePlanPage } from './components/SamplePlanPage';
import { AuthScreen } from './components/AuthScreen';
import { UserDashboard } from './components/UserDashboard';
import {ChatBot} from './components/ChatBot';
import { SavedPlans } from './components/SavedPlans';
import { AboutUs } from './components/AboutUs';
import { ContactUs } from './components/ContactUs';
import { generateLocalItinerary } from './services/localItinerary';
import { samplePlans } from './data/samplePlans';
import { AppScreen } from './types';
import { downloadItineraryPDF } from './services/pdfService';

function AppContent() {
  const { login: authLogin, signup: authSignup, signInWithGoogle: authGoogleSignIn, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState(AppScreen.LANDING);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSamplePlanId, setSelectedSamplePlanId] = useState(null);
  const [prefillFormData, setPrefillFormData] = useState(null);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const [navigationHistory, setNavigationHistory] = useState([AppScreen.LANDING]);
  const [verificationToken, setVerificationToken] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleStartPlanning = () => {
    setPrefillFormData(null);
    setSelectedSamplePlanId(null);
    setNavigationHistory(prev => [...prev, AppScreen.PLANNER]);
    setCurrentScreen(AppScreen.PLANNER);
    setError(null);
  };

  const handleStartPlanningWithPrefill = (formData) => {
    setPrefillFormData(formData);
    setSelectedSamplePlanId(null);
    setNavigationHistory(prev => [...prev, AppScreen.PLANNER]);
    setCurrentScreen(AppScreen.PLANNER);
    setError(null);
  };

  const handleNavigateToDashboard = () => {
    setNavigationHistory(prev => [...prev, AppScreen.DASHBOARD]);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    } else {
      // If no history, go to landing
      setCurrentScreen(AppScreen.LANDING);
      setNavigationHistory([AppScreen.LANDING]);
    }
  };

  const handleViewSamplePlan = (planId) => {
    if (!samplePlans[planId]) return;
    // Save current scroll position before navigating
    setSavedScrollPosition(window.scrollY || window.pageYOffset);
    setSelectedSamplePlanId(planId);
    setNavigationHistory(prev => [...prev, AppScreen.SAMPLE_PLAN]);
    setCurrentScreen(AppScreen.SAMPLE_PLAN);
    setError(null);
    // Scroll to top when sample plan page opens
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleEditSamplePlan = (plan) => {
    const selectedPlan = plan || (selectedSamplePlanId ? samplePlans[selectedSamplePlanId] : null);
    if (!selectedPlan) return;
    setPrefillFormData(selectedPlan.formData);
    setNavigationHistory(prev => [...prev, AppScreen.PLANNER]);
    setCurrentScreen(AppScreen.PLANNER);
  };

  const handlePlannerSubmit = async (data) => {
    setIsLoading(true);
    setCurrentScreen(AppScreen.LOADING);
    setError(null);
    try {
      // Convert new form data format to itinerary format for ItineraryScreen
      const itineraryDays = (data.itinerary || []).map(day => ({
        dayNumber: day.dayNumber,
        theme: `Day ${day.dayNumber}`,
        activities: day.activities.map(act => ({
          activity: act.activity,
          time: act.time,
          description: act.notes || '',
          location: data.destination,
          type: 'sightseeing',
        })),
      }));

      const result = {
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        budget: data.budget,
        interests: data.interests,
        days: itineraryDays,
      };
      setItinerary(result);
      setNavigationHistory(prev => [...prev, AppScreen.ITINERARY]);
      setCurrentScreen(AppScreen.ITINERARY);
    } catch (err) {
      console.error(err);
      setError("Failed to create itinerary. Please try again.");
      setCurrentScreen(AppScreen.PLANNER);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPlanner = () => {
    if (selectedSamplePlanId) {
      setCurrentScreen(AppScreen.SAMPLE_PLAN);
    } else {
      handleBackToHome();
    }
  };

  const handleBackToPlanner = () => {
    setCurrentScreen(AppScreen.PLANNER);
  };

  const handleOpenAuth = () => {
    setCurrentScreen(AppScreen.AUTH);
  };

  const handleLogin = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authLogin(data.email, data.password);
      if (result.success) {
        // Navigate to landing page after successful login
        setCurrentScreen(AppScreen.LANDING);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authSignup(data.email, data.password, data.name);
      if (result.success) {
        // Show success message and redirect to home after signup
        // User needs to verify email before full access
        setError('Verification email sent! Please check your inbox and verify your email.');
        // Wait a bit then go to home page
        setTimeout(() => {
          setCurrentScreen(AppScreen.LANDING);
          setError(null);
        }, 3000);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authGoogleSignIn();
      if (result.success) {
        // Navigate to landing page after successful Google sign-in
        setCurrentScreen(AppScreen.LANDING);
      } else {
        setError(result.error || 'Google sign-in failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during Google sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (currentScreen === AppScreen.LOADING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-light dark:bg-background-dark p-6 text-center space-y-6">
        <div className="relative size-24">
           <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
           <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-primary animate-pulse">flight</span>
           </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Creating your itinerary...</h2>
          <p className="text-gray-500 dark:text-gray-400">Generating your personalized trip plan based on your preferences.</p>
        </div>
      </div>
    );
  }


  const handleEditItinerary = (itineraryData) => {
    // Extract form data from itinerary to pre-fill the planner
    const formData = {
      destination: itineraryData.destination || '',
      startDate: itineraryData.startDate || (itineraryData.days?.[0]?.activities?.[0]?.date || ''),
      endDate: itineraryData.endDate || (itineraryData.days?.[itineraryData.days?.length - 1]?.activities?.[0]?.date || ''),
      budget: itineraryData.budget || 'Mid',
      interests: itineraryData.interests || [],
    };
    
    setPrefillFormData(formData);
    setNavigationHistory(prev => [...prev, AppScreen.PLANNER]);
    setCurrentScreen(AppScreen.PLANNER);
  };

  const handleDownloadPDF = (itineraryData) => {
    try {
      const result = downloadItineraryPDF(itineraryData);
      if (result.success) {
        // PDF downloaded successfully
        console.log('PDF downloaded successfully');
      } else {
        setError('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleSharePlan = async (itineraryData) => {
    try {
      const shareData = {
        title: `My Trip to ${itineraryData.destination || 'Destination'}`,
        text: `Check out my ${itineraryData.days?.length || 0}-day trip plan to ${itineraryData.destination || 'destination'}!`,
        url: window.location.href,
      };

      // Try Web Share API first (mobile-friendly)
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy link to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Plan link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        // Fallback: Copy link to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('Plan link copied to clipboard!');
        } catch (clipboardError) {
          console.error('Share error:', error);
          setError('Failed to share plan. Please try again.');
        }
      }
    }
  };

  const handleSavePlan = async (itineraryData) => {
    try {
      setIsLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('goplanner_token');

      // Convert itinerary format to trip format for backend
      const tripData = {
        destination: itineraryData.destination || '',
        startDate: itineraryData.startDate || (itineraryData.days?.[0]?.date || new Date().toISOString()),
        endDate: itineraryData.endDate || (itineraryData.days?.[itineraryData.days?.length - 1]?.date || new Date().toISOString()),
        budget: itineraryData.budget || 'Mid',
        interests: itineraryData.interests || [],
        itinerary: (itineraryData.itinerary || itineraryData.days || []).map(day => ({
          dayNumber: day.dayNumber || 1,
          date: day.date || new Date().toISOString(),
          activities: (day.activities || []).map(act => ({
            id: act.id || `${Date.now()}-${Math.random()}`,
            time: act.time || '',
            activity: act.activity || act.name || '',
            type: act.type || 'sightseeing',
            location: act.location || '',
            notes: act.notes || act.description || '',
            coordinates: act.coordinates || null,
            rating: act.rating || null,
            order: act.order || 1,
          })),
          weather: day.weather || null,
        })),
        coordinates: itineraryData.coordinates || null,
        status: 'planned',
      };

      const response = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(tripData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert('Plan saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Save plan error:', error);
      setError(error.message || 'Failed to save plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentScreen(AppScreen.LANDING);
    setItinerary(null);
    setError(null);
    setSelectedSamplePlanId(null);
    setPrefillFormData(null);
    setNavigationHistory([]);
  };

  if (currentScreen === AppScreen.ITINERARY && itinerary) {
    return (
      <ItineraryScreen 
        itinerary={itinerary} 
        onBack={handleGoBack} 
        onDashboard={handleNavigateToDashboard} 
        onEdit={handleEditItinerary}
        onSave={handleSavePlan}
        onShare={handleSharePlan}
        onDownload={handleDownloadPDF}
        onHome={handleBackToHome}
      />
    );
  }

  if (currentScreen === AppScreen.SAMPLE_PLAN && selectedSamplePlanId) {
    return (
      <SamplePlanPage
        plan={samplePlans[selectedSamplePlanId]}
        onBack={handleGoBack}
        onEdit={handleEditSamplePlan}
        onDashboard={handleNavigateToDashboard}
      />
    );
  }

  if (currentScreen === AppScreen.PLANNER) {
    return (
      <>
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg text-sm font-medium animate-bounce">
            {error}
          </div>
        )}
        <PlannerForm
          onSubmit={handlePlannerSubmit}
          onCancel={handleCancelPlanner}
          initialData={prefillFormData}
          onBack={handleGoBack}
          onDashboard={handleNavigateToDashboard}
        />
      </>
    );
  }

  if (currentScreen === AppScreen.AUTH) {
    return (
      <AuthScreen
        onBack={handleGoBack}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onGoogleSignIn={handleGoogleSignIn}
        isLoading={isLoading}
        error={error}
        onDashboard={handleNavigateToDashboard}
      />
    );
  }

  if (currentScreen === AppScreen.DASHBOARD) {
    return (
      <UserDashboard
        onBack={handleGoBack}
        onCreateTrip={handleStartPlanning}
        onSavedPlans={handleNavigateToSavedPlans}
      />
    );
  }

  // Email verification screen
  if (currentScreen === AppScreen.VERIFY_EMAIL) {
    return (
      <div className="relative min-h-screen bg-background-light text-slate-900 dark:bg-[#020617] dark:text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          {verificationStatus === 'success' ? (
            <>
              <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-green-600 dark:text-green-400">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Email Verified!</h2>
              <p className="text-slate-600 dark:text-slate-400">Your email has been successfully verified. You can now use all features of GoPlanner.</p>
              <Button onClick={() => setCurrentScreen(AppScreen.LANDING)}>Go to Home</Button>
            </>
          ) : verificationStatus === 'error' ? (
            <>
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-red-600 dark:text-red-400">error</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verification Failed</h2>
              <p className="text-slate-600 dark:text-slate-400">The verification link is invalid or has expired. Please request a new verification email.</p>
              <Button onClick={() => setCurrentScreen(AppScreen.LANDING)}>Go to Home</Button>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary animate-spin">hourglass_empty</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verifying Email...</h2>
              <p className="text-slate-600 dark:text-slate-400">Please wait while we verify your email address.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const handleNavigateToSavedPlans = () => {
    console.log('Navigating to Saved Plans, current screen:', currentScreen);
    setNavigationHistory(prev => [...prev, AppScreen.SAVED_PLANS]);
    setCurrentScreen(AppScreen.SAVED_PLANS);
    console.log('Set screen to:', AppScreen.SAVED_PLANS);
  };

  const handleNavigateToAboutUs = () => {
    setNavigationHistory(prev => [...prev, AppScreen.ABOUT_US]);
    setCurrentScreen(AppScreen.ABOUT_US);
  };

  const handleNavigateToContactUs = () => {
    setNavigationHistory(prev => [...prev, AppScreen.CONTACT_US]);
    setCurrentScreen(AppScreen.CONTACT_US);
  };

  if (currentScreen === AppScreen.CONTACT_US) {
    return (
      <ContactUs
        onBack={handleGoBack}
        onDashboard={handleNavigateToDashboard}
        onHome={handleBackToHome}
      />
    );
  }

  if (currentScreen === AppScreen.ABOUT_US) {
    return (
      <AboutUs
        onBack={handleGoBack}
        onDashboard={handleNavigateToDashboard}
        onStartPlanning={handleStartPlanning}
      />
    );
  }

  if (currentScreen === AppScreen.SAVED_PLANS) {
    console.log('Rendering SavedPlans component');
    return (
      <SavedPlans
        onBack={handleGoBack}
        onDashboard={handleNavigateToDashboard}
        onViewPlan={(trip) => {
          // Convert trip to itinerary format
          const itineraryDays = (trip.itinerary || []).map(day => ({
            dayNumber: day.dayNumber,
            theme: `Day ${day.dayNumber}`,
            activities: day.activities.map(act => ({
              activity: act.activity,
              time: act.time,
              description: act.notes || '',
              location: act.location || trip.destination,
              type: act.type || 'sightseeing',
            })),
          }));

          const result = {
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
            interests: trip.interests || [],
            days: itineraryDays,
          };
          setItinerary(result);
          setNavigationHistory(prev => [...prev, AppScreen.ITINERARY]);
          setCurrentScreen(AppScreen.ITINERARY);
        }}
        onEditPlan={(trip) => {
          // Convert trip to itinerary format for ItineraryScreen
          const itineraryDays = (trip.itinerary || []).map(day => ({
            dayNumber: day.dayNumber,
            theme: `Day ${day.dayNumber}`,
            activities: day.activities.map(act => ({
              activity: act.activity,
              time: act.time,
              description: act.notes || '',
              location: act.location || trip.destination,
              type: act.type || 'sightseeing',
            })),
          }));

          const result = {
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            budget: trip.budget,
            interests: trip.interests || [],
            days: itineraryDays,
          };
          setItinerary(result);
          setNavigationHistory(prev => [...prev, AppScreen.ITINERARY]);
          setCurrentScreen(AppScreen.ITINERARY);
        }}
      />
    );
  }

  return <LandingScreen onStartPlanning={handleStartPlanning} onViewSamplePlan={handleViewSamplePlan} onOpenAuth={handleOpenAuth} onOpenDashboard={() => setCurrentScreen(AppScreen.DASHBOARD)} onSavedPlans={handleNavigateToSavedPlans} onStartPlanningWithPrefill={handleStartPlanningWithPrefill} onAboutUs={handleNavigateToAboutUs} onContactUs={handleNavigateToContactUs} />;
}

function App() {
  // Check for email verification token in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathToken = window.location.pathname.split('/verify-email/')[1];
    const token = urlParams.get('token') || pathToken;
    
    if (token) {
      // This will be handled by AppContent component
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <AuthProvider>
      <AppContent />
      <ChatBot />
    </AuthProvider>
  );
}

export default App;