import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

const PRIORITY_STYLES = {
  high: 'border-l-destructive bg-destructive/5',
  medium: 'border-l-secondary bg-secondary/5',
  low: 'border-l-muted bg-card',
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
      return data || [];
    },
    enabled: !!user,
  });

  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = useMutation({
    mutationFn: async () => {
      await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markRead = useMutation({
    mutationFn: async (id) => {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const deleteNotif = useMutation({
    mutationFn: async (id) => {
      await supabase.from('notifications').delete().eq('id', id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="relative">
      {/* Bell button */}
      <button onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors relative">
        <Bell className="w-4 h-4 text-foreground" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-white rounded-full text-[9px] font-700 font-heading flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />}

      {/* Popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.92, y: -8, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: -8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-11 z-50 w-80 max-h-96 bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="font-heading text-sm font-700">Notifications</p>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={() => markAllRead.mutate()} className="flex items-center gap-1 text-xs text-primary font-body hover:underline">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-3xl mb-2">🔔</p>
                  <p className="font-body text-sm text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} onClick={() => markRead.mutate(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-l-4 cursor-pointer hover:bg-muted/30 transition-colors ${PRIORITY_STYLES[n.priority] || PRIORITY_STYLES.low} ${!n.read ? 'font-600' : 'opacity-70'}`}>
                    <span className="text-base mt-0.5">{n.icon || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm truncate">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(n.created_at)}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); deleteNotif.mutate(n.id); }}
                      className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0 mt-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
