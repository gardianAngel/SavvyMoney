import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BUDGET_CATEGORIES } from '@/lib/app-params';
import { Plus, Trash2 } from 'lucide-react';

export default function Budgets() {
  const { user } = useAuth();
  const { symbol } = useCurrency();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: BUDGET_CATEGORIES[0], amount: '' });

  const { data: budgets = [] } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('budgets').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createBudget = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('budgets').insert([{ ...data, user_id: user.id }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['budgets'] }); setShowCreate(false); setNewBudget({ category: BUDGET_CATEGORIES[0], amount: '' }); },
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
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button onClick={() => setShowCreate(true)} size="sm" className="rounded-full"><Plus className="w-4 h-4 mr-1" /> New Budget</Button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📊</div>
          <p className="font-semibold">No budgets set</p>
          <p className="text-sm text-muted-foreground mt-1">Create a budget to track your spending by category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((b) => (
            <div key={b.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">{b.category}</p>
                <p className="text-lg font-bold text-primary">{symbol}{Number(b.amount).toLocaleString()}<span className="text-xs text-muted-foreground font-normal"> / {b.period}</span></p>
              </div>
              <button onClick={() => deleteBudget.mutate(b.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>New Budget</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select value={newBudget.category} onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input placeholder={`Monthly limit (${symbol})`} type="number" value={newBudget.amount} onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })} className="rounded-xl" />
            <Button onClick={() => createBudget.mutate({ ...newBudget, amount: Number(newBudget.amount) })} className="w-full rounded-xl" disabled={!newBudget.amount}>Create Budget</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
