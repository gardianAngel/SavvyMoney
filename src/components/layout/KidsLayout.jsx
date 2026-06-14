import React from 'react';

export default function KidsLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-background dark:to-background">
      {children}
    </div>
  );
}
