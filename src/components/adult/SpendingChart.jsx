import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

export default function SpendingChart() {
  const { user } = useAuth();
  const { symbol } = useCurrency();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id, 'chart'],
    queryFn: async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', startOfMonth);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Group by category
  const categories = {};
  transactions.forEach(t => {
    const cat = t.category || 'Other';
    categories[cat] = (categories[cat] || 0) + Number(t.amount);
  });

  const total = Object.values(categories).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const colors = ['bg-primary', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="font-semibold mb-3">📊 This Month's Spending</h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No expenses recorded this month.</p>
      ) : (
        <>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {sorted.map(([cat, amount], i) => (
              <div key={cat} className={`${colors[i % colors.length]} h-full`} style={{ width: `${(amount / total) * 100}%` }} title={`${cat}: ${symbol}${amount.toLocaleString()}`} />
            ))}
          </div>
          <div className="space-y-2">
            {sorted.map(([cat, amount], i) => (
              <div key={cat} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`} />
                  <span>{cat}</span>
                </div>
                <span className="font-medium">{symbol}{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t text-sm font-semibold flex justify-between">
            <span>Total</span>
            <span>{symbol}{total.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
