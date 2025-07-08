"use client";

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { PrismApp } from '@/components/prism-app';
import { StartupPrompt } from '@/components/startup-prompt';
import { LoadingScreen } from '@/components/loading-screen';

export function AppLoader() {
  const [userName, setUserName] = useLocalStorage<string | null>('userName', null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading time for a better user experience
    // and to allow localStorage to initialize.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading screen
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!userName) {
    return <StartupPrompt onNameSubmit={setUserName} />;
  }

  return <PrismApp userName={userName} />;
}
