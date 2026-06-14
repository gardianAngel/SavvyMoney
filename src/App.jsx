import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/api/supabaseClient';

// Layouts
import AdultLayout from '@/components/layout/AdultLayout';
import KidsLayout from '@/components/layout/KidsLayout';

// Auth
import Auth from '@/components/Auth';
import ProfileSetup from '@/components/ProfileSetup';

// Pages
import Welcome from '@/pages/Welcome';
import Dashboard from '@/pages/adult/Dashboard';
import Track from '@/pages/adult/Track';
import Goals from '@/pages/adult/Goals';
import Budgets from '@/pages/adult/Budgets';
import Learn from '@/pages/adult/Learn';
import KidsDashboard from '@/pages/kids/KidsDashboard';
import KidsGoals from '@/pages/kids/KidsGoals';
import KidsLearn from '@/pages/kids/KidsLearn';
import KidsBadges from '@/pages/kids/KidsBadges';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

function AppContent() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (!user) { setProfile(null); return; }
    setProfileLoading(true);
    supabase.from('users').select('*').eq('id', user.id).maybeSingle()
      .then(({ data }) => { setProfile(data); setProfileLoading(false); });
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="text-5xl">💰</div>
        <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <Auth />;

  if (!profile?.profile_complete) {
    return <ProfileSetup onComplete={() => {
      supabase.from('users').select('*').eq('id', user.id).maybeSingle()
        .then(({ data }) => setProfile(data));
    }} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={<AdultLayout><Dashboard /></AdultLayout>} />
      <Route path="/track" element={<AdultLayout><Track /></AdultLayout>} />
      <Route path="/goals" element={<AdultLayout><Goals /></AdultLayout>} />
      <Route path="/budgets" element={<AdultLayout><Budgets /></AdultLayout>} />
      <Route path="/learn" element={<AdultLayout><Learn /></AdultLayout>} />
      <Route path="/kids" element={<KidsLayout><KidsDashboard /></KidsLayout>} />
      <Route path="/kids/goals" element={<KidsLayout><KidsGoals /></KidsLayout>} />
      <Route path="/kids/learn" element={<KidsLayout><KidsLearn /></KidsLayout>} />
      <Route path="/kids/badges" element={<KidsLayout><KidsBadges /></KidsLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
