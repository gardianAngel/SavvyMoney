import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Welcome() {
  const navigate = useNavigate();

  const handleSelect = (mode) => {
    localStorage.setItem('savvy_mode', mode);
    navigate(mode === 'kids' ? '/kids' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl" />

      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <div className="text-6xl mb-4">💰</div>
        <h1 className="font-heading text-4xl md:text-5xl font-900 tracking-tight text-foreground">SavvyMoney</h1>
        <p className="font-body text-muted-foreground text-lg mt-2">Learn. Save. Grow.</p>
      </motion.div>

      {/* Mode subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="font-heading text-xl font-700 mb-6"
      >
        Who are you?
      </motion.p>

      {/* Mode selection cards */}
      <div className="flex flex-col sm:flex-row gap-5 max-w-md w-full">
        {[
          { mode: 'kids', icon: '👶', title: "I'm a Kid", subtitle: 'Ages 6–15', tag: 'Fun & Games 🎮', tagClass: 'bg-secondary/20 text-secondary-foreground', borderHover: 'hover:border-secondary' },
          { mode: 'adult', icon: '🧑', title: "I'm 16 or Older", subtitle: 'Ages 16–35+', tag: 'Smart Tools 📊', tagClass: 'bg-primary/10 text-primary', borderHover: 'hover:border-primary' },
        ].map(({ mode, icon, title, subtitle, tag, tagClass, borderHover }) => (
          <motion.button
            key={mode}
            onClick={() => handleSelect(mode)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`group flex-1 bg-card rounded-2xl p-8 shadow-lg border-2 border-transparent ${borderHover} transition-colors text-center cursor-pointer`}
          >
            <div className="text-5xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
            <h2 className="font-heading text-lg font-800 text-foreground">{title}</h2>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-3">{subtitle}</p>
            <span className={`inline-block text-xs font-heading font-700 px-3 py-1 rounded-full ${tagClass}`}>{tag}</span>
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-xs text-muted-foreground mt-10"
      >
        Your financial journey starts here ✨
      </motion.p>
    </div>
  );
}
