import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Upload, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const CATEGORIES = ['food', 'transport', 'shopping', 'entertainment', 'health', 'education', 'bills', 'savings', 'other'];
const CAT_EMOJIS = { food: '🍔', transport: '🚗', shopping: '🛍️', entertainment: '🎬', health: '💊', education: '📚', bills: '🏠', savings: '🏦', other: '💼' };

export default function Track() {
  const { user } = useAuth();
  const { symbol } = useCurrency();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTx, setNewTx] = useState({ amount: '', type: 'expense', category: 'food', description: '', date: new Date().toISOString().split('T')[0] });
  const [csvState, setCsvState] = useState({ loading: false, preview: [], error: null, success: null });
  const fileRef = useRef();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addTx = useMutation({
    mutationFn: async (data) => {
      // ensure user row
      await supabase.from('users').upsert({ id: user.id, email: user.email, role: 'adult' }, { onConflict: 'id' });
      const { error } = await supabase.from('transactions').insert([{ ...data, user_id: user.id }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      setShowAdd(false);
      setNewTx({ amount: '', type: 'expense', category: 'food', description: '', date: new Date().toISOString().split('T')[0] });
    },
  });

  const deleteTx = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    },
  });

  const displayed = transactions.filter(t => filter === 'all' ? true : t.type === filter);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvState({ loading: true, preview: [], error: null, success: null });
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(Boolean).slice(1); // skip header
      const parsed = lines.map(line => {
        const [date, type, category, amount, description] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        return { date: date || new Date().toISOString().split('T')[0], type: type || 'expense', category: category || 'other', amount: Number(amount) || 0, description: description || '' };
      }).filter(t => t.amount > 0);
      setCsvState({ loading: false, preview: parsed, error: null, success: null });
    } catch {
      setCsvState({ loading: false, preview: [], error: 'Could not parse file. Please use CSV format: date,type,category,amount,description', success: null });
    }
  };

  const importAll = async () => {
    await supabase.from('users').upsert({ id: user.id, email: user.email, role: 'adult' }, { onConflict: 'id' });
    const rows = csvState.preview.map(t => ({ ...t, user_id: user.id }));
    const { error } = await supabase.from('transactions').insert(rows);
    if (error) { setCsvState(s => ({ ...s, error: error.message })); return; }
    setCsvState(s => ({ ...s, success: `Imported ${rows.length} transactions!`, preview: [] }));
    queryClient.invalidateQueries({ queryKey: ['transactions'] });
    queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-heading text-2xl font-800">Transactions</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowImport(true)} variant="outline" size="sm" className="rounded-full">
            <Upload className="w-3.5 h-3.5 mr-1" /> Import
          </Button>
          <Button onClick={() => setShowAdd(true)} size="sm" className="rounded-full">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-5">
        {[['all', 'All'], ['income', 'Income'], ['expense', 'Expenses']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-heading font-600 transition-all ${filter === val ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📝</div>
          <p className="font-heading text-base font-700">No transactions yet</p>
          <p className="font-body text-sm text-muted-foreground mt-1">Start tracking your income and expenses.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {displayed.map(tx => (
              <motion.div key={tx.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 10, opacity: 0 }}
                className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tx.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  {CAT_EMOJIS[tx.category] || '💼'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-500 truncate">{tx.description || tx.category}</p>
                  <p className="text-[10px] text-muted-foreground">{tx.category} · {new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <p className={`font-heading text-sm font-700 mr-1 ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{symbol}{Number(tx.amount).toLocaleString()}
                </p>
                <button onClick={() => deleteTx.mutate(tx.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-heading text-xl">Add Transaction</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex bg-muted rounded-xl p-1">
              {[['expense', 'Expense 💸'], ['income', 'Income 💰']].map(([val, label]) => (
                <button key={val} onClick={() => setNewTx(t => ({ ...t, type: val }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-heading font-600 transition-all ${newTx.type === val ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                  {label}
                </button>
              ))}
            </div>
            <Input placeholder={`Amount (${symbol})`} type="number" value={newTx.amount} onChange={e => setNewTx(t => ({ ...t, amount: e.target.value }))} className="rounded-xl font-body" />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setNewTx(t => ({ ...t, category: cat }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-heading font-600 transition-all ${newTx.category === cat ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>
                  {CAT_EMOJIS[cat]} {cat}
                </button>
              ))}
            </div>
            <textarea placeholder="Note (optional)" rows={2} value={newTx.description} onChange={e => setNewTx(t => ({ ...t, description: e.target.value }))}
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-body resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            <Input type="date" value={newTx.date} onChange={e => setNewTx(t => ({ ...t, date: e.target.value }))} className="rounded-xl font-body" />
            <Button onClick={() => addTx.mutate({ ...newTx, amount: Number(newTx.amount) })} className="w-full rounded-xl font-heading"
              disabled={!newTx.amount || Number(newTx.amount) <= 0 || addTx.isPending}>
              {addTx.isPending ? 'Adding...' : newTx.type === 'income' ? 'Add Income 💰' : 'Add Expense 💸'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="rounded-2xl">
          <DialogHeader><DialogTitle className="font-heading text-xl">Import CSV</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all text-center">
              <p className="font-body text-sm text-muted-foreground">Tap to upload CSV file</p>
              <p className="text-[10px] text-muted-foreground mt-1">Format: date,type,category,amount,description</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
            </div>
            {csvState.loading && <div className="flex items-center justify-center gap-2 text-sm font-body text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Analysing your file...</div>}
            {csvState.error && <div className="flex items-center gap-2 text-sm text-destructive"><AlertCircle className="w-4 h-4" />{csvState.error}</div>}
            {csvState.success && <div className="flex items-center gap-2 text-sm text-primary"><CheckCircle className="w-4 h-4" />{csvState.success}</div>}
            {csvState.preview.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {csvState.preview.map((t, i) => (
                  <div key={i} className="flex justify-between text-xs font-body py-1 border-b border-border">
                    <span>{t.description || t.category}</span>
                    <span className={t.type === 'income' ? 'text-primary' : 'text-destructive'}>{t.type === 'income' ? '+' : '-'}{symbol}{t.amount}</span>
                  </div>
                ))}
              </div>
            )}
            {csvState.preview.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCsvState({ loading: false, preview: [], error: null, success: null })} className="flex-1 rounded-xl">Cancel</Button>
                <Button onClick={importAll} className="flex-1 rounded-xl font-heading">Import All {csvState.preview.length} 💾</Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
