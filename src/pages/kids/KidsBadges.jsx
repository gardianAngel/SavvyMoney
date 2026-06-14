import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const ALL_BADGES = [
  { id: 'first_saver', name: 'First Saver', icon: '🌟', desc: 'Made your first savings deposit' },
  { id: 'on_track', name: 'On Track', icon: '🔥', desc: 'Saved 3 days in a row' },
  { id: 'money_master', name: 'Money Master', icon: '👑', desc: 'Completed all lessons' },
  { id: 'learner', name: 'Learner', icon: '📚', desc: 'Completed your first lesson' },
  { id: 'scholar', name: 'Scholar', icon: '🎓', desc: 'Scored 100% on a quiz' },
  { id: 'goal_setter', name: 'Goal Setter', icon: '🎯', desc: 'Created your first goal' },
  { id: 'goal_crusher', name: 'Goal Crusher', icon: '🏆', desc: 'Completed a savings goal' },
  { id: 'super_saver', name: 'Super Saver', icon: '🐷', desc: 'Saved 10 times total' },
];

export default function KidsBadges() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: earnedBadges = [] } = useQuery({
    queryKey: ['kidsBadges', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('user_badges').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const earnedIds = new Set(earnedBadges.map(b => b.badge_id));

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-800">My Badges ⭐</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">{earnedIds.size} of {ALL_BADGES.length} badges earned</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ALL_BADGES.map((badge, i) => {
          const earned = earnedIds.has(badge.id);
          return (
            <motion.div key={badge.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.06 }}
              className={`bg-card rounded-2xl p-5 text-center border shadow-sm transition-all ${earned ? 'border-secondary/40 bg-secondary/5' : 'border-border opacity-40 grayscale'}`}>
              <p className="text-4xl mb-2">{badge.icon}</p>
              <p className="font-heading text-sm font-700">{badge.name}</p>
              <p className="font-body text-[10px] text-muted-foreground mt-1">{badge.desc}</p>
              {earned && (
                <span className="inline-block mt-2 bg-secondary/20 rounded-full px-2 py-0.5 text-[10px] font-heading font-700">Earned ✨</span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" /> Switch to Adult Mode
        </Button>
      </div>
    </div>
  );
}
