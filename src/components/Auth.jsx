import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Auth() {
    const { signIn, signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const { error } = isLogin 
                ? await signIn({ email, password }) 
                : await signUp({ email, password });
            if (error) throw error;
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="max-w-md w-full p-6 bg-card rounded-2xl shadow-sm border border-border">
                <h1 className="text-2xl font-heading font-800 text-center mb-6">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-heading font-600 mb-1 block">Email</label>
                        <Input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            className="rounded-xl font-body"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-heading font-600 mb-1 block">Password</label>
                        <Input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="rounded-xl font-body"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" className="w-full rounded-xl font-heading">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)} 
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
