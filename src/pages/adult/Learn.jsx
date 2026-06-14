import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Zap, CheckCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ADULT_LESSONS } from '@/lib/lessons';

export default function Learn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(null);

  const { data: progress = [] } = useQuery({
    queryKey: ['lessonProgress', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('lesson_progress').select('*').eq('user_id', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  const completedIds = new Set(progress.map(p => p.lesson_id));
  const completedCount = completedIds.size;

  const complete = useMutation({
    mutationFn: async (lessonId) => {
      await supabase.from('users').upsert({ id: user.id, email: user.email, role: 'adult' }, { onConflict: 'id' });
      const { error } = await supabase.from('lesson_progress').upsert({
        user_id: user.id, lesson_id: lessonId, status: 'completed', completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessonProgress'] }),
  });

  const pct = Math.round((completedCount / ADULT_LESSONS.length) * 100);

  return (
    <div className="p-5 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-heading text-2xl font-800">Learn 📚</h1>
        <span className="font-body text-sm text-muted-foreground">{completedCount}/{ADULT_LESSONS.length} lessons</span>
      </div>
      <div className="w-full bg-muted rounded-full h-2 mb-5">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
          className="h-full bg-primary rounded-full" />
      </div>

      {/* Lesson cards */}
      <div className="space-y-3">
        {ADULT_LESSONS.map((lesson, i) => {
          const done = completedIds.has(lesson.id);
          return (
            <motion.div key={lesson.id} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.05 }}
              onClick={() => !done && setSelected(lesson)}
              className={`bg-card rounded-2xl p-4 border transition-all flex items-center gap-3 ${done ? 'border-primary/20 opacity-70' : 'border-border hover:shadow-md cursor-pointer'}`}>
              <span className="text-2xl">{lesson.emoji}</span>
              <div className="flex-1">
                <p className="font-heading text-sm font-700">{lesson.title}</p>
                <div className="flex gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-body"><Clock className="w-3 h-3" />{lesson.duration}</span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-body"><Zap className="w-3 h-3" />{lesson.points} pts</span>
                </div>
              </div>
              {done && <CheckCircle className="w-5 h-5 text-primary" />}
            </motion.div>
          );
        })}
      </div>

      {/* Switch mode */}
      <div className="text-center mt-8">
        <Button variant="ghost" onClick={() => navigate('/kids')} className="gap-2 text-muted-foreground">
          <LogOut className="w-4 h-4" /> Switch to Kids Mode
        </Button>
      </div>

      {/* Lesson dialog */}
      <AnimatePresence>
        {selected && (
          <Dialog open={!!selected} onOpenChange={() => { setSelected(null); setAnswered(null); }}>
            <DialogContent className="rounded-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">{selected.emoji} {selected.title}</DialogTitle>
              </DialogHeader>
              <p className="font-body text-sm whitespace-pre-line text-foreground leading-relaxed">{selected.content}</p>

              {/* Quiz */}
              {selected.quiz && (
                <div className="bg-muted/50 rounded-xl p-4 mt-2 space-y-3">
                  <p className="font-heading text-sm font-700">Quick Quiz</p>
                  <p className="font-body text-sm">{selected.quiz.question}</p>
                  <div className="space-y-2">
                    {selected.quiz.options.map((opt, i) => (
                      <button key={i} onClick={() => setAnswered(i)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-body border transition-all ${answered === i ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={() => { complete.mutate(selected.id); setSelected(null); setAnswered(null); }}
                className="w-full rounded-xl font-heading mt-2"
                disabled={complete.isPending}>
                {completedIds.has(selected?.id) ? 'Already Completed ✅' : 'Mark as Complete ✅'}
              </Button>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
