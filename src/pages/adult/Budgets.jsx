import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'health', 'education', 'bills', 'savings', 'other'];
const CAT_EMOJIS = { food: '🍔', transport: '🚗', shopping: '🛍️', entertainment: '🎬', health: '💊', education: '📚', bills: '🏠', savings: '🏦', other: '💼' };
const PERIODS = ['daily', 'weekly', 'monthly'];

export default function Budgets() {
  const { user } = useAuth();
  const { symbol } = useCurrency();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'food', amount: '', period: 'monthly' });

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('budgets').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('transactions').select('amount, category, date').eq('user_id', user.id).eq('type', 'expense');
      return data || [];
    },
    enabled: !!user,
  });

  const getSpent = (budget) => {
    const now = new Date();
    return transactions
      .filter(t => {
        if (t.category !== budget.category) return false;
        const d = new Date(t.date);
        if (budget.period === 'daily') return d.toDateString() === now.toDateString();
        if (budget.period === 'weekly') {
          const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
          return d >= weekAgo;
        }
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, t) => s + Number(t.amount), 0);
  };

  const addBudget = useMutation({
    mutationFn: async (data) => {
      await supabase.from('users').upsert({ id: user.id, email: user.email, role: 'adult' }, { onConflict: 'id' });
      const { error } = await supabase.from('budgets').insert([{ ...data, user_id: user.id }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); setShowAdd(false); setNewBudget({ category: 'food', amount: '', period: 'monthly' }); },
  });

  const deleteBudget = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['budgets'] }),
  });

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-heading text-2xl font-800">Budgets</h1>
        <Button onClick={() => setShowAdd(true)} size="sm" className="rounded-full">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Budget
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">💼</div>
          <p className="font-heading text-base font-700">No budgets yet</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Set spending limits for each category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget, i) => {
            const spent = getSpent(budget);
            const pct = Math.min(100, Math.round((spent / budget.amount) * 100));
            const over = spent > budget.amount;
            const warn = pct >= 80 && !over;
            return (
              <motion.div key={budget.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{CAT_EMOJIS[budget.category] || '💼'}</span>
                    <div>
                      <p className="font-heading text-sm font-700 capitalize">{budget.category}</p>
                      <p className="text-[10px] text-muted-foreground font-body capitalize">{budget.period}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteBudget.mutate(budget.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between mb-1.5">
                  <span className={`text-xs font-body font-600 ${over ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {symbol}{spent.toLocaleString()} spent
                  </span>
                  <span className="text-xs font-body text-muted-foreground">of {symbol}{Number(budget.amount).toLocaleString()}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                    className={`h-full rounded-full ${over ? 'bg-destructive' : warn ? 'bg-secondary' : 'bg-primary'}`} />
                </div>
                {over && (
                  <p className="text-[10px] font-700 text-destructive mt-1">
                    Over budget by {symbol}{(spent - budget.amount).toLocaleString()}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-heading text-xl">Add Budget</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-heading text-sm font-600 mb-2 block">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setNewBudget(b => ({ ...b, category: cat }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-heading font-600 transition-all ${newBudget.category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
                    {CAT_EMOJIS[cat]} {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="font-heading text-sm font-600 mb-2 block">Period</label>
              <div className="flex bg-muted rounded-xl p-1">
                {PERIODS.map(p => (
                  <button key={p} onClick={() => setNewBudget(b => ({ ...b, period: p }))}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-heading font-600 transition-all capitalize ${newBudget.period === p ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Input placeholder={`Budget amount (${symbol})`} type="number" value={newBudget.amount} onChange={e => setNewBudget(b => ({ ...b, amount: e.target.value }))} className="rounded-xl font-body" />
            <Button onClick={() => addBudget.mutate({ ...newBudget, amount: Number(newBudget.amount) })} className="w-full rounded-xl font-heading"
              disabled={!newBudget.amount || Number(newBudget.amount) <= 0 || addBudget.isPending}>
              {addBudget.isPending ? 'Saving...' : 'Save Budget'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
