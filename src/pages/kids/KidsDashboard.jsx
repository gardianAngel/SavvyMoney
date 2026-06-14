import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function KidsDashboard() {
  const { user } = useAuth();
  const { symbol } = useCurrency();

  const { data: goals = [] } = useQuery({
    queryKey: ['kidsGoals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('savings_goals').select('*').eq('user_id', user.id).eq('status', 'active').limit(3);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['kidsBadges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_badges').select('*').eq('user_id', user.id).limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="p-5 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1">Hey there! 🌟</h1>
        <p className="text-muted-foreground text-sm mb-5">Ready to be a money superstar today?</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xs text-muted-foreground">Goals</p>
            <p className="text-lg font-bold">{goals.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-xs text-muted-foreground">Badges</p>
            <p className="text-lg font-bold">{badges.length}</p>
          </CardContent>
        </Card>
      </div>

      {goals.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-sm mb-3">Your Savings Goals 🎯</h2>
          <div className="space-y-3">
            {goals.map(g => {
              const pct = g.target_amount > 0 ? Math.min(100, Math.round(((g.saved_amount || 0) / g.target_amount) * 100)) : 0;
              return (
                <div key={g.id} className="bg-card rounded-2xl p-3 border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{g.icon || '🎯'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{g.title}</p>
                      <p className="text-xs text-muted-foreground">{symbol}{(g.saved_amount || 0).toLocaleString()} of {symbol}{g.target_amount.toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-bold text-primary">{pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-primary rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
