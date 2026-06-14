import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

export function useSpendingAlerts() {
  const { user } = useAuth();

  const { data: alerts = [] } = useQuery({
    queryKey: ['spendingAlerts', user?.id],
    queryFn: async () => {
      // Get budgets and current month spending
      const { data: budgets, error: bErr } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);
      if (bErr) throw bErr;

      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const { data: transactions, error: tErr } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', startOfMonth);
      if (tErr) throw tErr;

      // Calculate alerts per category
      return (budgets || []).map(budget => {
        const spent = (transactions || [])
          .filter(t => t.category === budget.category)
          .reduce((sum, t) => sum + Number(t.amount), 0);
        const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
        return {
          category: budget.category,
          budget: budget.amount,
          spent,
          percentage: pct,
          isOver: pct >= 100,
          isWarning: pct >= 80 && pct < 100,
        };
      }).filter(a => a.isWarning || a.isOver);
    },
    enabled: !!user,
    refetchInterval: 60000, // Check every minute
  });

  return { alerts };
}
