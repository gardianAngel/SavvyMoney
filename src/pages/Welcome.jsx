import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Welcome({ onGetStarted }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md px-6"
      >
        <div className="text-6xl mb-6">💰</div>
        <h1 className="text-3xl font-bold mb-3">Welcome to SavvyMoney</h1>
        <p className="text-muted-foreground mb-8">
          Your smart companion for budgeting, saving, and learning about money — for the whole family.
        </p>
        <Button onClick={onGetStarted} size="lg" className="rounded-full px-8">
          Get Started 🚀
        </Button>
      </motion.div>
    </div>
  );
}
