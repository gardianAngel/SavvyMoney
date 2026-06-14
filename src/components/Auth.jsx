import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // prevent double-submit
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await signIn({ email, password });
                if (error) throw error;
            } else {
                const { error, data } = await signUp({ email, password });
                if (error) throw error;
                // If email confirmation is enabled, data.user will be null
                if (data?.user && !data.session) {
                    setSuccess('Account created! Check your email to confirm your account, then sign in.');
                }
            }
        } catch (err) {
            const msg = err.message || '';
            if (msg.includes('security purposes') || msg.includes('rate limit') || msg.includes('after')) {
                setError('Too many attempts. Please wait a moment and try again.');
            } else if (msg.includes('Invalid login credentials')) {
                setError('Incorrect email or password. Please try again.');
            } else if (msg.includes('Email not confirmed')) {
                setError('Please check your email inbox and confirm your account before signing in.');
            } else if (msg.includes('User already registered')) {
                setError('An account with this email already exists. Try signing in instead.');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-md w-full p-8 bg-card rounded-2xl shadow-lg border border-border"
            >
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">💰</div>
                    <h1 className="text-2xl font-bold">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isLogin ? 'Sign in to your SavvyMoney account' : 'Join SavvyMoney today'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="you@example.com"
                            className="rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="••••••••"
                            minLength={6}
                            className="rounded-xl"
                        />
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.p
                                key="error"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg"
                            >
                                ⚠️ {error}
                            </motion.p>
                        )}
                        {success && (
                            <motion.p
                                key="success"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                className="text-sm text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-400 p-3 rounded-lg"
                            >
                                ✅ {success}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <Button
                        type="submit"
                        className="w-full rounded-xl"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                {isLogin ? 'Signing in...' : 'Creating account...'}
                            </span>
                        ) : (
                            isLogin ? 'Sign In' : 'Sign Up'
                        )}
                    </Button>
                </form>

                <div className="mt-5 text-center">
                    <button
                        type="button"
                        onClick={() => { setIsLogin(!isLogin); setError(null); setSuccess(null); }}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Sign in'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
