import React from 'react';
import { Button } from '@/components/ui/button';

export default function UserNotRegisteredError({ onRetry }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-xl font-bold mb-2">Account Not Found</h2>
        <p className="text-muted-foreground mb-6">Your account hasn't been set up yet. Please complete registration first.</p>
        {onRetry && <Button onClick={onRetry}>Try Again</Button>}
      </div>
    </div>
  );
}
