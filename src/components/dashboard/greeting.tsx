"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function Greeting({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    setCurrentDate(format(new Date(), 'EEEE, MMMM do'));
  }, []);

  if (!greeting) {
    return (
        <div className="mb-6">
            <Skeleton className="h-9 w-1/2 mb-2" />
            <Skeleton className="h-5 w-1/3" />
        </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-3xl font-bold tracking-tight text-foreground">{greeting}, {userName}.</h2>
      <p className="text-muted-foreground">{currentDate}</p>
    </div>
  );
}
