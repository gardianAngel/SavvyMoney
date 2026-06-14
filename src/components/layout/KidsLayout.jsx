import React from 'react';
import { NavLink } from 'react-router-dom';
import KidsChatBot from '@/components/chat/KidsChatBot';

const NAV_ITEMS = [
  { emoji: '🏠', label: 'Home', path: '/kids' },
  { emoji: '🎯', label: 'Goals', path: '/kids/goals' },
  { emoji: '📚', label: 'Learn', path: '/kids/learn' },
  { emoji: '⭐', label: 'Badges', path: '/kids/badges' },
];

export default function KidsLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      {/* Scrollable content */}
      <div className="flex-1 pb-20 pt-2 overflow-y-auto">
        {children}
      </div>

      {/* KidsChat FAB */}
      <KidsChatBot />

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50 h-16 flex items-center justify-around px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ emoji, label, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/kids'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 flex-1 py-1.5 rounded-xl transition-all ${isActive ? 'bg-secondary/20 scale-105' : 'opacity-60 hover:opacity-100'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className="text-xl">{emoji}</span>
                <span className={`text-[10px] font-heading font-600 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
