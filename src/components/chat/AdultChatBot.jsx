import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const QUICK_PROMPTS = [
  'How do I start budgeting?',
  'What is the 50/30/20 rule?',
  'How much should I save?',
];

export default function AdultChatBot() {
  const { profile } = useAuth();
  const { symbol, currency, country } = useCurrency();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm SavvyBot 💰 Your personal finance assistant. Ask me anything about budgeting, saving, or investing in ${country}!` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const systemContext = `You are SavvyBot, a friendly personal finance assistant for SavvyMoney app. 
The user is from ${country || 'Nigeria'} and uses ${currency || 'NGN'} (${symbol || '₦'}) as their currency. 
Always give practical, actionable financial advice relevant to their local context.
Keep responses concise (2-4 sentences). Be encouraging and positive.`;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemContext + '\n\nUser: ' + userText }] },
          ],
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure, but try checking your budget first!";
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Sorry, I had trouble connecting. Please check your internet and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center"
          >
            <Lightbulb className="w-6 h-6 text-primary-foreground" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            className="fixed bottom-20 right-3 z-50 w-[calc(100vw-24px)] max-w-sm bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
            style={{ height: 450 }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-heading font-800 text-primary-foreground text-sm">SavvyBot</p>
                <p className="text-[10px] text-primary-foreground/70">Your finance assistant</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/70 hover:text-primary-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ height: 320 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Quick prompts */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {QUICK_PROMPTS.map(p => (
                    <button key={p} onClick={() => sendMessage(p)}
                      className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-[10px] font-heading font-600 hover:bg-primary/20 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center"><Lightbulb className="w-3.5 h-3.5 text-primary" /></div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm font-body text-muted-foreground">Thinking...</div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <div className="flex-1 bg-muted rounded-xl px-3 py-2 flex items-center">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent text-sm font-body outline-none"
                />
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center disabled:opacity-50">
                <Send className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
