import { useState } from 'react';
import { APP_MODES, DEFAULT_MODE } from '@/lib/app-params';

export function useAppMode() {
  const [mode, setMode] = useState(
    () => localStorage.getItem('appMode') || DEFAULT_MODE
  );

  const switchMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('appMode', newMode);
  };

  return {
    mode,
    setMode: switchMode,
    isAdult: mode === APP_MODES.ADULT,
    isKids: mode === APP_MODES.KIDS,
  };
}
