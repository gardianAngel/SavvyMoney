import React from 'react';

export default function UpdateBanner({ message = "A new version is available!", onDismiss }) {
  return (
    <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm flex items-center justify-center gap-2">
      <span>🔄 {message}</span>
      <button onClick={() => window.location.reload()} className="underline font-medium">Refresh</button>
      {onDismiss && <button onClick={onDismiss} className="ml-2 opacity-70 hover:opacity-100">✕</button>}
    </div>
  );
}
