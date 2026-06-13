import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

const GOAL_ICONS = ['🏠', '📱', '💼', '🎓', '🚗', '✈️', '🆘', '💰', '🎯', '🛍️'];

export default function Goals() {
    const [showCreate, setShowCreate] = useState(false);
    const [showDeposit, setShowDeposit] = useState(null);
    const [newGoal, setNewGoal] = useState({ title: '', target_amount: '', icon: '💰', deadline: '' });
    const [depositAmount, setDepositAmount] = useState('');
    const queryClient = useQueryClient();
    const { symbol } = useCurrency();

    const { data: goals = [] } = useQuery({
        queryKey: ['savingsGoals'],
        queryFn: () => base44.entities.SavingsGoal.list('-created_date', 20),
    });

    const createGoal = useMutation({
        mutationFn: (data) => base44.entities.SavingsGoal.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
            setShowCreate(false);
            setNewGoal({ title: '', target_amount: '', icon: '💰', deadline: '' });
        }
    });

    const updateGoal = useMutation({
        mutationFn: ({ id, data }) => base44.entities.SavingsGoal.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savingsGoals'] });
            setShowDeposit(null);
            setDepositAmount('');
        }
    });

    const deleteGoal = useMutation({
        mutationFn: (id) => base44.entities.SavingsGoal.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['savingsGoals'] }),
    });

    const handleDeposit = (goal) => {
        const amt = Number(depositAmount);
        if (amt <= 0) return;
        const newSaved = (goal.saved_amount || 0) + amt;
        const status = newSaved >= goal.target_amount ? 'completed' : 'active';
        updateGoal.mutate({ id: goal.id, data: { saved_amount: newSaved, status } });
    };

    const activeGoals = goals.filter(g => g.status !== 'completed');
    const completedGoals = goals.filter(g => g.status === 'completed');

    return (
        <div className="p-5 max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-5">
                <h1 className="font-heading text-2xl font-800">Savings Goals</h1>
                <Button onClick={() => setShowCreate(true)} size="sm" className="rounded-full font-heading">
                    <Plus className="w-4 h-4 mr-1" /> New Goal
                </Button>
            </div>

            {goals.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-3">🎯</div>
                    <p className="font-heading text-base font-700">No savings goals</p>
                    <p className="font-body text-sm text-muted-foreground mt-1">Set a goal and start saving today!</p>
                </div>
            ) : (
                <>
                    {activeGoals.length > 0 && (
                        <div className="space-y-3 mb-6">
                            <AnimatePresence>
                                {activeGoals.map((goal) => {
                                    const pct = goal.target_amount > 0 ? Math.min(100, Math.round(((goal.saved_amount || 0) / goal.target_amount) * 100)) : 0;
                                    return (
                                        <motion.div
                                            key={goal.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-card rounded-2xl p-4 border border-border shadow-sm"
                                        >
                                            <div className="flex items-start gap-3 mb-3">
                                                <span className="text-2xl">{goal.icon || '🎯'}</span>
                                                <div className="flex-1">
                                                    <p className="font-heading text-sm font-700">{goal.title}</p>
                                                    <p className="font-body text-xs text-muted-foreground">
                                                        {symbol}{(goal.saved_amount || 0).toLocaleString()} of {symbol}{goal.target_amount.toLocaleString()}
                                                    </p>
                                                    {goal.deadline && (
                                                        <p className="font-body text-[10px] text-muted-foreground mt-0.5">Due: {goal.deadline}</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button size="sm" variant="outline" className="rounded-lg text-xs font-heading h-8" onClick={() => setShowDeposit(goal)}>
                                                        + Save
                                                    </Button>
                                                    <button onClick={() => deleteGoal.mutate(goal.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8 }}
                                                    className="h-full bg-primary rounded-full"
                                                />
                                            </div>
                                            <p className="font-heading text-[10px] font-600 text-right mt-1 text-primary">{pct}%</p>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    )}

                    {completedGoals.length > 0 && (
                        <div>
                            <h2 className="font-heading text-sm font-700 text-muted-foreground mb-3">Completed 🏆</h2>
                            <div className="space-y-2">
                                {completedGoals.map((goal) => (
                                    <div key={goal.id} className="bg-primary/5 rounded-xl p-3 border border-primary/20 flex items-center gap-3">
                                        <span className="text-xl">{goal.icon || '🏆'}</span>
                                        <div className="flex-1">
                                            <p className="font-heading text-sm font-600">{goal.title}</p>
                                            <p className="font-body text-xs text-primary">{symbol}{goal.target_amount.toLocaleString()} saved!</p>
                                        </div>
                                        <span className="text-lg">✅</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Create Goal Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl">New Savings Goal</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="font-heading text-sm font-600 mb-2 block">Choose an icon</label>
                            <div className="flex gap-2 flex-wrap">
                                {GOAL_ICONS.map((icon) => (
                                    <button
                                        key={icon}
                                        onClick={() => setNewGoal({ ...newGoal, icon })}
                                        className={`text-xl p-2 rounded-xl transition-all ${newGoal.icon === icon ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-muted'}`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Input
                            placeholder="What are you saving for?"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                            className="rounded-xl font-body"
                        />
                        <Input
                            placeholder={`Target amount (${symbol})`}
                            type="number"
                            value={newGoal.target_amount}
                            onChange={(e) => setNewGoal({ ...newGoal, target_amount: e.target.value })}
                            className="rounded-xl font-body"
                        />
                        <Input
                            type="date"
                            value={newGoal.deadline}
                            onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                            className="rounded-xl font-body"
                        />
                        <Button
                            onClick={() => createGoal.mutate({ ...newGoal, target_amount: Number(newGoal.target_amount), saved_amount: 0, status: 'active' })}
                            className="w-full rounded-xl font-heading"
                            disabled={!newGoal.title || !newGoal.target_amount}
                        >
                            Create Goal 🎯
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Deposit Dialog */}
            <Dialog open={!!showDeposit} onOpenChange={() => setShowDeposit(null)}>
                <DialogContent className="rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="font-heading text-xl">Add to Savings</DialogTitle>
                    </DialogHeader>
                    <div className="text-center mb-4">
                        <span className="text-4xl">{showDeposit?.icon || '💰'}</span>
                        <p className="font-heading text-sm font-600 mt-2">{showDeposit?.title}</p>
                    </div>
                    <div className="flex gap-2 justify-center mb-3">
                        {[500, 1000, 2000, 5000].map((amt) => (
                            <button
                                key={amt}
                                onClick={() => setDepositAmount(String(amt))}
                                className={`px-3 py-2 rounded-xl font-heading text-xs font-700 transition-all ${depositAmount === String(amt) ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
                                    }`}
                            >
                                {symbol}{amt.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <Input
                        placeholder={`Or enter custom amount (${symbol})`}
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="rounded-xl font-body"
                    />
                    <Button
                        onClick={() => handleDeposit(showDeposit)}
                        className="w-full rounded-xl font-heading mt-2"
                        disabled={!depositAmount || Number(depositAmount) <= 0}
                    >
                        Save Now 💰
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}