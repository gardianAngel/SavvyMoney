import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DAILY_CHALLENGES } from '@/lib/lessons';

const CHART_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#a855f7', '#ef4444', '#06b6d4', '#ec4899', '#6366f1'];

const CATEGORY_EMOJIS = {
  food: '🍔', transport: '🚗', shopping: '🛍️', entertainment: '🎬',
  health: '💊', education: '📚', bills: '🏠', savings: '🏦', other: '💼',
};

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { symbol } = useCurrency();
  const today = new Date();
  const dayChallenge = DAILY_CHALLENGES[today.getDay() % DAILY_CHALLENGES.length];

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', user?.id],
    queryFn: async () => {
      const [{ data: income }, { data: expenses }, { data: goals }, { data: recent }] = await Promise.all([
        supabase.from('transactions').select('amount').eq('user_id', user.id).eq('type', 'income').gte('date', startOfMonth),
        supabase.from('transactions').select('amount, category').eq('user_id', user.id).eq('type', 'expense').gte('date', startOfMonth),
        supabase.from('savings_goals').select('saved_amount, target_amount').eq('user_id', user.id).eq('status', 'active'),
        supabase.from('transactions').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
      ]);
      const totalIncome = (income || []).reduce((s, t) => s + Number(t.amount), 0);
      const totalExpenses = (expenses || []).reduce((s, t) => s + Number(t.amount), 0);
      const totalSaved = (goals || []).reduce((s, g) => s + Number(g.saved_amount || 0), 0);
      const balance = totalIncome - totalExpenses;

      // Spending by category
      const catMap = {};
      (expenses || []).forEach(t => {
        catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
      });
      const chartData = Object.entries(catMap).map(([cat, val]) => ({ name: cat, value: val }));

      // Smart insights
      const topCat = chartData.sort((a, b) => b.value - a.value)[0];
      const secondCat = chartData[1];
      const topPct = totalExpenses > 0 && topCat ? Math.round((topCat.value / totalExpenses) * 100) : 0;

      return { totalIncome, totalExpenses, totalSaved, balance, chartData, recent: recent || [], topCat, secondCat, topPct };
    },
    enabled: !!user,
  });

  const hasExpenses = (stats?.chartData?.length || 0) > 0;

  return (
    <div className="p-5 max-w-lg mx-auto">
      {/* Header */}
      <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-5">
        <p className="font-body text-sm text-muted-foreground">Welcome back</p>
        <h1 className="font-heading text-2xl font-800">
          {profile?.full_name ? `Hey, ${profile.full_name.split(' ')[0]}! 💰` : 'SavvyMoney 💰'}
        </h1>
      </motion.div>

      {/* Balance Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground shadow-lg mb-5"
      >
        <p className="text-sm opacity-80 font-body mb-1">Total Balance</p>
        <p className="font-heading text-3xl font-900 mb-4">{symbol}{(stats?.balance || 0).toLocaleString()}</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70 font-body">Income</p>
              <p className="text-sm font-heading font-700">{symbol}{(stats?.totalIncome || 0).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] opacity-70 font-body">Expenses</p>
              <p className="text-sm font-heading font-700">{symbol}{(stats?.totalExpenses || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Insights */}
      {hasExpenses && stats?.topCat && (
        <motion.div
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-accent/10 rounded-2xl p-4 mb-5 border border-accent/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-accent" />
            <span className="text-[10px] font-heading font-700 uppercase tracking-wide text-accent">Smart Insights</span>
          </div>
          <p className="font-body text-sm text-foreground">
            <strong>{stats.topCat.name}</strong> is your top spend at <strong>{stats.topPct}%</strong> of expenses.
            {stats.secondCat && ` Consider cutting 20% on ${stats.secondCat.name} to boost savings.`}
          </p>
        </motion.div>
      )}

      {/* Daily Challenge */}
      <motion.div
        initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="bg-secondary/10 rounded-2xl p-4 mb-5 border border-secondary/20"
      >
        <span className="text-[10px] font-heading font-700 uppercase tracking-wide text-secondary-foreground opacity-60">Daily Challenge</span>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-2xl">{dayChallenge.icon}</span>
          <p className="font-heading text-sm font-700">{dayChallenge.title}</p>
        </div>
      </motion.div>

      {/* Spending Chart */}
      {hasExpenses && (
        <div className="bg-card rounded-2xl p-5 border border-border mb-5 shadow-sm">
          <p className="font-heading text-sm font-700 mb-3">Spending Breakdown</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={stats.chartData} innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" stroke="none">
                {stats.chartData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val) => `${symbol}${Number(val).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {stats.chartData.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i] }} />
                <span className="text-[10px] font-body text-muted-foreground truncate">
                  {CATEGORY_EMOJIS[item.name] || '💼'} {item.name} ({Math.round(item.value / (stats.totalExpenses || 1) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {(stats?.recent?.length || 0) > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-heading text-sm font-700">Recent Transactions</p>
            <Link to="/track" className="flex items-center gap-1 text-xs text-primary font-body">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {stats.recent.map((tx) => (
              <div key={tx.id} className="bg-card rounded-xl p-3 border border-border flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${tx.type === 'income' ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  {CATEGORY_EMOJIS[tx.category] || '💼'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-500 truncate">{tx.description || tx.category}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
                <p className={`font-heading text-sm font-700 ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                  {tx.type === 'income' ? '+' : '-'}{symbol}{Number(tx.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goals overview */}
      {stats?.totalSaved > 0 && (
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="font-body text-xs text-muted-foreground mb-1">Total saved across all goals</p>
          <p className="font-heading text-xl font-800 text-primary">{symbol}{stats.totalSaved.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
