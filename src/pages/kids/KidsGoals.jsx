import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

const KID_ICONS = ['🎮', '🧸', '📚', '🎨', '⚽', '🎵', '🐶', '🍦', '🎁', '🌈'];

export default function KidsGoals() {
  const { user } = useAuth();
  const { symbol } = useCurrency();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target_amount: '', icon: '🎮' });

  const { data: goals = [] } = useQuery({
    queryKey: ['kidsGoals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('savings_goals').select('*').eq('user_id', user.id).order('created_date', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createGoal = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('savings_goals').insert([{ ...data, user_id: user.id, saved_amount: 0, status: 'active' }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['kidsGoals'] }); setShowCreate(false); setNewGoal({ title: '', target_amount: '', icon: '🎮' }); },
  });

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">My Goals 🎯</h1>
        <Button onClick={() => setShowCreate(true)} size="sm" className="rounded-full">+ New Goal</Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🎯</div>
          <p className="font-bold">No goals yet!</p>
          <p className="text-sm text-muted-foreground">What do you want to save for?</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {goals.map((goal) => {
              const pct = goal.target_amount > 0 ? Math.min(100, Math.round(((goal.saved_amount || 0) / goal.target_amount) * 100)) : 0;
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`rounded-2xl p-4 border-2 ${goal.status === 'completed' ? 'border-green-300 bg-green-50/50' : 'border-border bg-card'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{goal.icon || '🎯'}</span>
                    <div className="flex-1">
                      <p className="font-bold">{goal.title}</p>
                      <p className="text-sm text-muted-foreground">{symbol}{(goal.saved_amount || 0).toLocaleString()} / {symbol}{goal.target_amount.toLocaleString()}</p>
                    </div>
                    {goal.status === 'completed' && <span className="text-2xl">🎉</span>}
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-gradient-to-r from-primary to-green-400 rounded-full" />
                  </div>
                  <p className="text-xs font-bold text-right mt-1 text-primary">{pct}% done!</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="text-xl">New Goal! 🌟</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Pick an emoji!</label>
              <div className="flex gap-2 flex-wrap">
                {KID_ICONS.map((icon) => (
                  <button key={icon} onClick={() => setNewGoal({ ...newGoal, icon })}
                    className={`text-2xl p-2 rounded-xl ${newGoal.icon === icon ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}>{icon}</button>
                ))}
              </div>
            </div>
            <Input placeholder="What are you saving for?" value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} className="rounded-xl" />
            <Input placeholder={`How much? (${symbol})`} type="number" value={newGoal.target_amount} onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })} className="rounded-xl" />
            <Button onClick={() => createGoal.mutate({ ...newGoal, target_amount: Number(newGoal.target_amount) })} className="w-full rounded-xl" disabled={!newGoal.title || !newGoal.target_amount}>
              Create Goal! 🚀
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
