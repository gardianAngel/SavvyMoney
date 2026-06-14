import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { KIDS_LESSONS } from '@/lib/lessons';

export default function KidsLearn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [pickedAnswer, setPickedAnswer] = useState(null);
  const [result, setResult] = useState(null); // 'correct' | 'wrong'

  const { data: progress = [] } = useQuery({
    queryKey: ['kidsProgress', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('lesson_progress').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const completedIds = new Set(progress.map(p => p.lesson_id));

  const complete = useMutation({
    mutationFn: async ({ lessonId, score }) => {
      await supabase.from('users').upsert({ id: user.id, email: user.email, role: 'adult' }, { onConflict: 'id' });
      const { error } = await supabase.from('lesson_progress').upsert({
        user_id: user.id, lesson_id: lessonId, status: 'completed', score,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['kidsProgress'] }),
  });

  const checkAnswer = () => {
    if (pickedAnswer === null) return;
    const correct = pickedAnswer === selected.quiz.answer;
    const score = correct ? selected.points : Math.floor(selected.points / 2);
    setResult(correct ? 'correct' : 'wrong');
    complete.mutate({ lessonId: selected.id, score });
  };

  const close = () => { setSelected(null); setPickedAnswer(null); setResult(null); };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <div className="mb-5">
        <h1 className="font-heading text-2xl font-800">Learn About Money 📚</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Short fun lessons to make you money-smart!</p>
      </div>

      <div className="space-y-3">
        {KIDS_LESSONS.map((lesson, i) => {
          const done = completedIds.has(lesson.id);
          return (
            <motion.div key={lesson.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.08 }}
              onClick={() => !done && setSelected(lesson)}
              className={`bg-card rounded-2xl p-4 border flex items-center gap-3 transition-all ${done ? 'border-primary/30 bg-primary/5 opacity-80' : 'border-border hover:shadow-md cursor-pointer'}`}>
              <span className="text-3xl">{lesson.emoji}</span>
              <div className="flex-1">
                <p className="font-heading text-sm font-700">{lesson.title}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{lesson.duration} · {lesson.points} pts</p>
              </div>
              {done && <span className="text-xl">✅</span>}
            </motion.div>
          );
        })}
      </div>

      {/* Lesson dialog */}
      <Dialog open={!!selected} onOpenChange={close}>
        <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">{selected?.emoji} {selected?.title}</DialogTitle>
          </DialogHeader>

          {!result ? (
            <>
              <p className="font-body text-sm whitespace-pre-line text-foreground leading-relaxed">{selected?.content}</p>

              {selected?.quiz && (
                <div className="bg-muted/50 rounded-xl p-4 mt-2 space-y-3">
                  <p className="font-heading text-sm font-700">Quick Quiz! 🧠</p>
                  <p className="font-body text-sm">{selected.quiz.question}</p>
                  <div className="space-y-2">
                    {selected.quiz.options.map((opt, i) => (
                      <button key={i} onClick={() => setPickedAnswer(i)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body border transition-all ${pickedAnswer === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  <Button onClick={checkAnswer} disabled={pickedAnswer === null || complete.isPending} className="w-full rounded-xl font-heading">
                    Check Answer ✅
                  </Button>
                </div>
              )}
            </>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6 space-y-3">
              <div className="text-5xl">{result === 'correct' ? '🎉' : '😅'}</div>
              <p className={`font-heading text-xl font-800 ${result === 'correct' ? 'text-primary' : 'text-foreground'}`}>
                {result === 'correct' ? 'Correct!' : 'Not quite!'}
              </p>
              {result === 'correct' ? (
                <p className="font-body text-sm text-muted-foreground">You earned <strong className="text-primary">{selected?.points} points</strong>! 🌟</p>
              ) : (
                <>
                  <p className="font-body text-sm text-muted-foreground">The correct answer was: <strong>{selected?.quiz.options[selected?.quiz.answer]}</strong></p>
                  <p className="font-body text-xs text-muted-foreground">You still earned {Math.floor((selected?.points || 0) / 2)} points for trying!</p>
                </>
              )}
              <Button onClick={close} className="w-full rounded-xl font-heading mt-2">Continue 🚀</Button>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
