import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { CURRENCIES } from '@/hooks/useCurrency';
import { supabase } from '@/api/supabaseClient';

export default function ProfileSetup({ onComplete }) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(null); // { country, flag, currency, symbol }
  const [birthday, setBirthday] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const calcAge = (dob) => {
    if (!dob) return null;
    const b = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - b.getFullYear();
    if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) age--;
    return age;
  };

  const age = calcAge(birthday);

  const validate = () => {
    if (!name.trim()) return 'Name is required.';
    if (!selected) return 'Please select your country & currency.';
    if (!birthday) return 'Birthday is required.';
    if (age === null || age < 0 || age > 120) return 'Please enter a valid birthday.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setSaving(true);
    setError('');
    try {
      const { error: upsertError } = await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        full_name: name.trim(),
        role: 'adult',
        birthday,
        age,
        country: selected.country,
        currency: selected.currency,
        currency_symbol: selected.symbol,
        profile_complete: true,
      });
      if (upsertError) throw upsertError;
      onComplete?.();
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-card rounded-2xl shadow-xl p-8 border border-border"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👋</div>
          <h1 className="font-heading text-2xl font-800">Welcome to SavvyMoney!</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Let's set up your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="font-heading text-sm font-600 mb-1.5 block">Your Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amara"
              className="rounded-xl font-body"
            />
          </div>

          {/* Country & Currency */}
          <div>
            <label className="font-heading text-sm font-600 mb-1.5 block">Country & Currency</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {CURRENCIES.map((c) => (
                <button
                  key={c.currency}
                  type="button"
                  onClick={() => setSelected(c)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-left transition-all ${
                    selected?.currency === c.currency
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted border-transparent hover:border-border'
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <div className="min-w-0">
                    <p className="font-heading text-xs font-600 truncate">{c.country}</p>
                    <p className="text-[10px] opacity-70">{c.symbol} {c.currency}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label className="font-heading text-sm font-600 mb-1.5 block">Birthday</label>
            <Input
              type="date"
              value={birthday}
              max={today}
              onChange={(e) => setBirthday(e.target.value)}
              className="rounded-xl font-body"
            />
            {birthday && age !== null && (
              <p className="text-xs text-muted-foreground mt-1.5 font-body">Age: {age} years old</p>
            )}
          </div>

          {/* Error */}
          {error && <p className="text-xs text-destructive font-body">{error}</p>}

          <Button
            type="submit"
            className="w-full rounded-xl font-heading font-700"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Get Started 🚀'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
