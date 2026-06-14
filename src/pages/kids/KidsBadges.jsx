import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

const ALL_BADGES = [
  { id: 'first-goal', name: 'Goal Setter', icon: '🎯', description: 'Created your first savings goal' },
  { id: 'first-save', name: 'First Save', icon: '💰', description: 'Made your first deposit' },
  { id: 'budget-master', name: 'Budget Master', icon: '📊', description: 'Created 3 budgets' },
  { id: 'lesson-learner', name: 'Quick Learner', icon: '📚', description: 'Completed your first lesson' },
  { id: 'streak-3', name: '3-Day Streak', icon: '🔥', description: 'Logged in 3 days in a row' },
  { id: 'goal-complete', name: 'Goal Crusher', icon: '🏆', description: 'Completed a savings goal' },
  { id: 'saver-100', name: 'Century Saver', icon: '💎', description: 'Saved 100 in total' },
  { id: 'lesson-5', name: 'Knowledge Seeker', icon: '🧠', description: 'Completed 5 lessons' },
];

export default function KidsBadges() {
  const { user } = useAuth();

  const { data: earned = [] } = useQuery({
    queryKey: ['kidsBadges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_badges').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const earnedIds = new Set(earned.map(b => b.badge_id));

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">My Badges 🏆</h1>
      <p className="text-sm text-muted-foreground mb-5">Earn badges by saving money, completing goals, and learning!</p>
      <div className="grid grid-cols-2 gap-3">
        {ALL_BADGES.map((badge) => {
          const isEarned = earnedIds.has(badge.id);
          return (
            <motion.div key={badge.id} whileHover={{ scale: 1.03 }}
              className={`rounded-2xl p-4 border-2 text-center transition-all ${isEarned ? 'border-primary bg-primary/5' : 'border-border bg-card opacity-50 grayscale'}`}>
              <div className="text-4xl mb-2">{badge.icon}</div>
              <p className="font-bold text-sm">{badge.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              {isEarned && <p className="text-xs text-primary mt-2 font-medium">Earned! ⭐</p>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
