import React from 'react';
import Goals from './pages/adult/Goals';
import Auth from './components/Auth';
import { useAuth } from './hooks/useAuth';
import { Button } from './components/ui/button';

function App() {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 flex justify-between items-center border-b border-border">
        <h1 className="font-heading font-700">SavvyMoney</h1>
        <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
      </header>
      <Goals />
    </div>
  );
}

export default App;
