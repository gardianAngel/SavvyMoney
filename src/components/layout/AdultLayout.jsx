import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Target, Wallet, BookOpen } from 'lucide-react';
import NotificationBell from '@/components/notifications/NotificationBell';
import AdultChatBot from '@/components/chat/AdultChatBot';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: PlusCircle, label: 'Track', path: '/track' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Wallet, label: 'Budget', path: '/budgets' },
  { icon: BookOpen, label: 'Learn', path: '/learn' },
];

export default function AdultLayout({ children }) {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative">
      {/* Top notification bell */}
      <div className="fixed top-0 right-0 z-40 p-3 max-w-lg" style={{ right: 'max(0px, calc(50vw - 512px / 2))' }}>
        <NotificationBell />
      </div>

      {/* Scrollable content */}
      <div className="flex-1 pb-20 pt-2 overflow-y-auto">
        {children}
      </div>

      {/* ChatBot FAB */}
      <AdultChatBot />

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-50 h-16 flex items-center justify-around px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 flex-1 py-1.5 relative transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.75px]'}`} />
                <span className={`text-[10px] font-heading font-600 ${isActive ? 'text-primary' : ''}`}>{label}</span>
                {isActive && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
