import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InsightsCard from '@/components/adult/InsightsCard';
import SpendingChart from '@/components/adult/SpendingChart';

export default function Dashboard() {
  const { user } = useAuth();
  const { symbol } = useCurrency();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

      const [{ data: income }, { data: expenses }, { data: goals }] = await Promise.all([
        supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income').gte('date', startOfMonth),
        supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'expense').gte('date', startOfMonth),
        supabase.from('savings_goals').select('saved_amount, target_amount').eq('user_id', user.id).eq('status', 'active'),
      ]);

      const totalIncome = (income || []).reduce((s, t) => s + Number(t.amount), 0);
      const totalExpenses = (expenses || []).reduce((s, t) => s + Number(t.amount), 0);
      const totalSaved = (goals || []).reduce((s, g) => s + Number(g.saved_amount || 0), 0);

      return { totalIncome, totalExpenses, totalSaved, balance: totalIncome - totalExpenses };
    },
    enabled: !!user,
  });

  const statCards = [
    { title: 'Income', value: stats?.totalIncome || 0, icon: '📈', color: 'text-green-600' },
    { title: 'Expenses', value: stats?.totalExpenses || 0, icon: '📉', color: 'text-red-500' },
    { title: 'Balance', value: stats?.balance || 0, icon: '💵', color: 'text-primary' },
    { title: 'Saved', value: stats?.totalSaved || 0, icon: '🏦', color: 'text-blue-500' },
  ];

  return (
    <div className="p-5 max-w-2xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s) => (
          <Card key={s.title}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span>{s.icon}</span>
                <span className="text-xs text-muted-foreground">{s.title}</span>
              </div>
              <p className={`text-lg font-bold ${s.color}`}>{symbol}{s.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <SpendingChart />
      <InsightsCard />
    </div>
  );
}
