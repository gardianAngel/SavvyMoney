import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/api/supabaseClient';

export default function ProfileSetup({ onComplete }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('adult');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        name,
        role,
      });
      if (error) throw error;
      onComplete?.();
    } catch (err) {
      console.error('Profile setup error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-2xl shadow-sm border border-border">
        <h1 className="text-2xl font-bold text-center mb-6">Set Up Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Your Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required className="rounded-xl" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">I am a...</label>
            <div className="flex gap-2">
              {['adult', 'kid'].map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${role === r ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
                >
                  {r === 'adult' ? '🧑 Adult' : '👶 Kid'}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={!name || saving}>
            {saving ? 'Saving...' : 'Continue'}
          </Button>
        </form>
      </div>
    </div>
  );
}
