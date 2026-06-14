import { useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

// Syncs a user's birthday to calculate and store their age
export function useBirthdayAgeSync(birthday) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !birthday) return;

    const age = Math.floor(
      (new Date() - new Date(birthday)) / (365.25 * 24 * 60 * 60 * 1000)
    );

    supabase
      .from('users')
      .update({ age })
      .eq('id', user.id)
      .then(({ error }) => {
        if (error) console.error('Failed to sync age:', error);
      });
  }, [user, birthday]);
}
