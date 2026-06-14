import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TIPS = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.",
  "Set up an emergency fund covering 3-6 months of expenses.",
  "Track every expense — small purchases add up quickly!",
  "Review your subscriptions monthly and cancel ones you don't use.",
  "Automate your savings so you pay yourself first.",
];

export default function AdultChatBot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm your SavvyMoney assistant. Ask me about budgeting, saving, or investing! 💰" },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
    const botMsg = { role: 'bot', text: `Great question! Here's a tip: ${tip}` };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[400px] bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-3 border-b font-semibold text-sm">🤖 Money Assistant</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask me anything..." className="rounded-xl" />
        <Button onClick={handleSend} size="sm" className="rounded-xl">Send</Button>
      </div>
    </div>
  );
}
