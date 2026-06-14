import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const QUICK_PROMPTS = [
  'What is money?',
  'How do I save?',
  'What is a budget?',
];

export default function KidsChatBot() {
  const { profile } = useAuth();
  const { symbol, country } = useCurrency();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hoot hoot! 🦉 I'm Wisey the Owl! I'm here to help you learn about money. What would you like to know?` },
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
      const systemContext = `You are Wisey the Owl, a friendly financial educator for children aged 6-15 on the SavvyMoney app.
The child is from ${country || 'Nigeria'} and uses ${symbol || '₦'} as currency.
Use simple, fun, encouraging language appropriate for children. 
Keep responses short (2-3 sentences max), use emojis, and make learning about money fun!
Never use complex financial jargon.`;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: systemContext + '\n\nChild asks: ' + userText }] },
          ],
        }),
      });
      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Hoot! Great question! Keep saving and learning! 🦉";
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Oops! I lost my way 🦉 Try asking me again!' }]);
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
            className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full bg-secondary shadow-lg flex items-center justify-center"
          >
            <span className="text-2xl">🦉</span>
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
            style={{ height: 430 }}
          >
            {/* Header */}
            <div className="bg-secondary px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center">
                <span className="text-xl">🦉</span>
              </div>
              <div className="flex-1">
                <p className="font-heading font-800 text-secondary-foreground text-sm">Wisey the Owl</p>
                <p className="text-[10px] text-secondary-foreground/70">Your money guide!</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-secondary-foreground/70 hover:text-secondary-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto p-3 space-y-2" style={{ height: 300 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sm">🦉</span>
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm font-body ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {messages.length === 1 && (
                <div className="flex flex-wrap gap-1.5 pl-9">
                  {QUICK_PROMPTS.map(p => (
                    <button key={p} onClick={() => sendMessage(p)}
                      className="bg-secondary/20 text-secondary-foreground rounded-full px-2.5 py-1 text-[10px] font-heading font-600 hover:bg-secondary/40 transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center"><span className="text-sm">🦉</span></div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2 text-sm font-body text-muted-foreground">Hooting...</div>
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
                  placeholder="Ask Wisey anything..."
                  className="flex-1 bg-transparent text-sm font-body outline-none"
                />
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
