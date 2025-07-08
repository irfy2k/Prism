"use client";

import { useMemo } from 'react';
import type { Habit } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, Check, ShieldOff } from 'lucide-react';
import {
  isToday,
  parseISO,
  subDays,
  startOfDay,
  eachDayOfInterval,
  endOfWeek,
  startOfWeek,
  differenceInDays,
} from 'date-fns';

interface HabitTrackerProps {
  habit: Habit;
  onDelete: (id: string) => void;
  onToggleCompletion: (id: string, date: string) => void;
}

export function HabitTracker({ habit, onDelete, onToggleCompletion }: HabitTrackerProps) {
  const todayISO = startOfDay(new Date()).toISOString();
  
  // For 'build' habits, this is a completion. For 'break' habits, this is a slip-up.
  const isToggledToday = habit.completions.includes(todayISO);

  const streak = useMemo(() => {
    const completions = habit.completions.map(c => startOfDay(parseISO(c))).sort((a,b) => a.getTime() - b.getTime());

    if (habit.type === 'break') {
      if (completions.length === 0) return 0; // Or calculate from creation date if available
      const lastSlipUp = completions[completions.length - 1];
      return differenceInDays(new Date(), lastSlipUp);
    }
    
    // 'build' habit logic (original)
    if (completions.length === 0) return 0;
    
    const completionDates = new Set(completions.map(c => c.getTime()));
    let currentStreak = 0;
    let checkDate = startOfDay(new Date());

    if (!completionDates.has(checkDate.getTime())) {
      checkDate = subDays(checkDate, 1);
    }
  
    while (completionDates.has(checkDate.getTime())) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    }
    return currentStreak;

  }, [habit.completions, habit.type]);

  const weeklyViewData = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const completionsSet = new Set(habit.completions.map(c => startOfDay(parseISO(c)).getTime()));
    
    return days.map(day => ({
      day,
      toggled: completionsSet.has(startOfDay(day).getTime()),
    }));
  }, [habit.completions]);


  const isBuildHabit = habit.type === 'build';

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>{habit.name}</CardTitle>
          <CardDescription className="capitalize">{isBuildHabit ? 'Build Habit' : 'Break Habit'} - {habit.frequency}</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="font-bold text-lg text-foreground">{streak}</span>
          <span className="text-xs">day streak</span>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        {habit.frequency === 'daily' ? (
           <p className="text-sm text-muted-foreground">
           {isBuildHabit
             ? (isToggledToday ? 'Completed today. Great job!' : 'Mark as complete for today.')
             : (isToggledToday ? 'You slipped up today.' : `You're doing great! Keep it up.`)}
         </p>
        ) : (
          <div className="flex gap-1 justify-center">
            {weeklyViewData.map(({ day, toggled }) => {
                const buttonColor = isBuildHabit
                  ? (toggled ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-primary/20')
                  : (toggled ? 'bg-destructive text-destructive-foreground' : 'bg-muted hover:bg-destructive/20');
              return (
                <button
                    key={day.toISOString()}
                    onClick={() => onToggleCompletion(habit.id, startOfDay(day).toISOString())}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs transition-colors ${buttonColor}`}
                    aria-label={`Toggle for ${day.toLocaleDateString()}`}
                >
                    {day.getDate()}
                </button>
            )})}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        {habit.frequency === 'daily' && (
          <Button
            onClick={() => onToggleCompletion(habit.id, todayISO)}
            variant={isToggledToday ? 'outline' : 'default'}
            className={`w-full ${!isBuildHabit && !isToggledToday ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' : ''}`}
          >
            {isBuildHabit ? (
                <>
                    <Check className="mr-2 h-4 w-4"/>
                    {isToggledToday ? 'Mark as Incomplete' : 'Complete for Today'}
                </>
            ) : (
                <>
                    <ShieldOff className="mr-2 h-4 w-4"/>
                    {isToggledToday ? 'Undo Slip-up' : 'I Slipped Up'}
                </>
            )}
          </Button>
        )}
         <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(habit.id)}
            aria-label={`Delete habit "${habit.name}"`}
            className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
