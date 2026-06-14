import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BUDGET_CATEGORIES, TRANSACTION_TYPES } from '@/lib/app-params';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Track() {
  const { user } = useAuth();
  const { symbol } = useCurrency();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newTx, setNewTx] = useState({ amount: '', type: 'expense', category: BUDGET_CATEGORIES[0], description: '' });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addTransaction = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from('transactions').insert([{ ...data, user_id: user.id, date: new Date().toISOString() }]);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['transactions'] }); setShowAdd(false); setNewTx({ amount: '', type: 'expense', category: BUDGET_CATEGORIES[0], description: '' }); },
  });

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => setShowAdd(true)} size="sm" className="rounded-full"><Plus className="w-4 h-4 mr-1" /> Add</Button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📝</div>
          <p className="font-semibold">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your income and expenses.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{tx.description || tx.category}</p>
                <p className="text-xs text-muted-foreground">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
              </div>
              <p className={`font-semibold text-sm ${tx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}{symbol}{Number(tx.amount).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              {['expense', 'income'].map((type) => (
                <button key={type} onClick={() => setNewTx({ ...newTx, type })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${newTx.type === type ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >{type === 'income' ? '📈 Income' : '📉 Expense'}</button>
              ))}
            </div>
            <Input placeholder={`Amount (${symbol})`} type="number" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} className="rounded-xl" />
            <select value={newTx.category} onChange={(e) => setNewTx({ ...newTx, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {BUDGET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input placeholder="Description (optional)" value={newTx.description} onChange={(e) => setNewTx({ ...newTx, description: e.target.value })} className="rounded-xl" />
            <Button onClick={() => addTransaction.mutate({ ...newTx, amount: Number(newTx.amount) })} className="w-full rounded-xl" disabled={!newTx.amount}>Add Transaction</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
