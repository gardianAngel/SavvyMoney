import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const RESPONSES = [
  "Saving money is like planting seeds — it grows over time! 🌱",
  "A piggy bank is a great place to start saving! 🐷",
  "Try setting a goal to save for something you really want! 🎯",
  "Remember: needs vs wants. Food is a need, toys are a want! 🤔",
  "Every coin counts! Even small savings add up to big things! ✨",
];

export default function KidsChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hey there! I'm Savvy the Money Owl! 🦉 Ask me about saving money!" },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const resp = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    const botMsg = { role: 'bot', text: resp };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-card rounded-xl border-2 border-primary/20 overflow-hidden">
      <div className="p-3 border-b font-bold text-sm bg-primary/5">🦉 Savvy the Money Owl</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask Savvy..." className="rounded-full" />
        <Button onClick={handleSend} size="sm" className="rounded-full">🚀</Button>
      </div>
    </div>
  );
}
