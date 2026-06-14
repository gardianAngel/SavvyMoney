import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';
import { DAILY_CHALLENGES, KIDS_LESSONS } from '@/lib/lessons';

const today = new Date();
const challenge = DAILY_CHALLENGES[today.getDay() % DAILY_CHALLENGES.length];

export default function KidsDashboard() {
  const { user, profile } = useAuth();
  const { symbol } = useCurrency();

  const { data: goals = [] } = useQuery({
    queryKey: ['kidsGoals', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('savings_goals').select('*').eq('user_id', user.id).eq('status', 'active').limit(3);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['kidsBadges', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('user_badges').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ['kidsProgress', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('lesson_progress').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const totalSaved = goals.reduce((s, g) => s + Number(g.saved_amount || 0), 0);
  const points = progress.reduce((s, p) => s + (p.score || 0), 0);

  return (
    <div className="p-5 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-5">
        <h1 className="font-heading text-2xl font-800">
          Hey, {profile?.full_name?.split(' ')[0] || 'Super Saver'}! 🌟
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Let's learn about money today!</p>
      </motion.div>

      {/* Piggy Bank Card */}
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 text-center border border-primary/10 mb-5">
        <div className="text-6xl mb-3">🐷</div>
        <p className="font-body text-sm text-muted-foreground mb-1">My Savings</p>
        <p className="font-heading text-3xl font-900 text-foreground">{symbol}{totalSaved.toLocaleString()}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-lg">⭐</p>
            <p className="font-heading text-sm font-700">{points}</p>
            <p className="text-[10px] text-muted-foreground font-body">points</p>
          </div>
          <div className="text-center">
            <p className="text-lg">🏅</p>
            <p className="font-heading text-sm font-700">{badges.length}</p>
            <p className="text-[10px] text-muted-foreground font-body">badges</p>
          </div>
          <div className="text-center">
            <p className="text-lg">📚</p>
            <p className="font-heading text-sm font-700">{progress.length}</p>
            <p className="text-[10px] text-muted-foreground font-body">lessons</p>
          </div>
        </div>
      </motion.div>

      {/* Daily Challenge */}
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-secondary/10 rounded-2xl p-5 border border-secondary/20 mb-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div className="flex-1">
            <p className="text-[10px] font-heading font-700 uppercase tracking-wide text-secondary-foreground opacity-60">Today's Challenge</p>
            <p className="font-heading text-sm font-700 mt-0.5">{challenge.title}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{challenge.desc}</p>
          </div>
          <span className="bg-secondary/20 rounded-full px-3 py-1 text-xs font-heading font-700 ml-auto">+10 pts</span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { emoji: '💰', label: 'Save Money', path: '/kids/goals' },
          { emoji: '🧠', label: 'Learn', path: '/kids/learn' },
        ].map(({ emoji, label, path }) => (
          <Link key={path} to={path}>
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md transition-all text-center cursor-pointer">
              <p className="text-3xl mb-2">{emoji}</p>
              <p className="font-heading text-sm font-700">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Active Goals Preview */}
      {goals.length > 0 && (
        <div className="space-y-2">
          <p className="font-heading text-sm font-700 mb-2">My Goals 🎯</p>
          {goals.map(goal => {
            const pct = goal.target_amount > 0 ? Math.min(100, Math.round((Number(goal.saved_amount || 0) / goal.target_amount) * 100)) : 0;
            return (
              <div key={goal.id} className="bg-card rounded-xl p-4 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{goal.icon || '🎯'}</span>
                  <p className="font-heading text-sm font-700">{goal.title}</p>
                  <p className="font-heading text-xs font-700 text-primary ml-auto">{pct}%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
