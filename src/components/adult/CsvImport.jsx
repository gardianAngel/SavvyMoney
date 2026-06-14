import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function CsvImport() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      const transactions = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, i) => { obj[h] = values[i]; });

        return {
          user_id: user.id,
          amount: Math.abs(Number(obj.amount || 0)),
          type: Number(obj.amount || 0) >= 0 ? 'income' : 'expense',
          category: obj.category || 'Other',
          description: obj.description || obj.memo || '',
          date: obj.date || new Date().toISOString(),
        };
      }).filter(t => t.amount > 0);

      const { error } = await supabase.from('transactions').insert(transactions);
      if (error) throw error;

      setResult({ success: true, count: transactions.length });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border">
      <h3 className="font-semibold mb-2">📁 Import Transactions</h3>
      <p className="text-sm text-muted-foreground mb-3">Upload a CSV file with columns: date, amount, category, description</p>
      <input type="file" accept=".csv" onChange={handleFileChange} disabled={importing} className="text-sm" />
      {importing && <p className="text-sm text-muted-foreground mt-2">Importing...</p>}
      {result?.success && <p className="text-sm text-green-600 mt-2">✅ Imported {result.count} transactions</p>}
      {result?.error && <p className="text-sm text-destructive mt-2">❌ {result.error}</p>}
    </div>
  );
}
