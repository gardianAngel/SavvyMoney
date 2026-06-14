import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { lessons, getLessonById } from '@/lib/lessons';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function KidsLearn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeLesson, setActiveLesson] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const { data: progress = [] } = useQuery({
    queryKey: ['lessonProgress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from('lesson_progress').select('*').eq('user_id', user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ lessonId, score }) => {
      const { error } = await supabase.from('lesson_progress').upsert({
        user_id: user.id, lesson_id: lessonId, status: 'completed', score, completed_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessonProgress'] }),
  });

  const isCompleted = (id) => progress.some(p => p.lesson_id === id && p.status === 'completed');
  const kidsLessons = lessons.filter(l => l.category === 'kids');

  if (activeLesson) {
    const lesson = getLessonById(activeLesson);
    const step = lesson.content[currentStep];
    const isLast = currentStep === lesson.content.length - 1;

    return (
      <div className="p-5 max-w-lg mx-auto">
        <button onClick={() => { setActiveLesson(null); setCurrentStep(0); }} className="text-sm text-muted-foreground mb-4">← Back</button>
        <h2 className="text-xl font-bold mb-4">{lesson.icon} {lesson.title}</h2>
        <div className="bg-card rounded-2xl border-2 border-primary/20 p-5">
          {step.type === 'text' && <p className="text-sm leading-relaxed">{step.value}</p>}
          {step.type === 'quiz' && (
            <div>
              <p className="font-bold mb-3">🤔 {step.question}</p>
              <div className="space-y-2">
                {step.options.map((opt, i) => (
                  <button key={i} onClick={() => setSelectedAnswer(i)}
                    className={`w-full text-left p-3 rounded-xl text-sm transition-all ${selectedAnswer === i ? (i === step.answer ? 'bg-green-100 border-green-500 border-2' : 'bg-red-100 border-red-500 border-2') : 'bg-muted hover:bg-muted/80'}`}
                  >{opt} {selectedAnswer === i && (i === step.answer ? '✅' : '❌')}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Step {currentStep + 1} of {lesson.content.length}</span>
            <Button size="sm" className="rounded-full" onClick={() => {
              if (isLast) { completeMutation.mutate({ lessonId: activeLesson, score: 100 }); setActiveLesson(null); setCurrentStep(0); }
              else { setCurrentStep(currentStep + 1); setSelectedAnswer(null); }
            }}>{isLast ? 'Done! 🎉' : 'Next →'}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-5">Learn About Money! 📚</h1>
      <div className="space-y-3">
        {kidsLessons.map((lesson) => (
          <motion.div key={lesson.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setActiveLesson(lesson.id)}
            className="bg-card rounded-2xl p-4 border-2 border-primary/10 cursor-pointer hover:border-primary/30 transition-all">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{lesson.icon}</span>
              <div className="flex-1">
                <p className="font-bold text-sm">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">{lesson.description}</p>
              </div>
              {isCompleted(lesson.id) ? <span className="text-xl">⭐</span> : <span className="text-xl">▶️</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
