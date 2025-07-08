"use client";

import type { Task, Habit, Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Check, Clock, TrendingUp } from "lucide-react";
import { isToday, parseISO, startOfDay, subDays, differenceInDays } from "date-fns";

interface SummaryCardsProps {
  tasks: Task[];
  habits: Habit[];
  transactions: Transaction[];
}

function getHabitStreak(habit: Habit): number {
  const completions = habit.completions.map(c => startOfDay(parseISO(c))).sort((a,b) => a.getTime() - b.getTime());

  if (habit.type === 'break') {
    if (completions.length === 0) return 0; // Or a large number if we track creation date
    const lastSlipUp = completions[completions.length - 1];
    return differenceInDays(new Date(), lastSlipUp);
  }

  // 'build' habit logic
  if (completions.length === 0) return 0;
  
  const completionDates = new Set(completions.map(c => c.getTime()));
  let streak = 0;
  let checkDate = startOfDay(new Date());

  // If not completed today, check from yesterday
  if (!completionDates.has(checkDate.getTime())) {
    checkDate = subDays(checkDate, 1);
  }

  // Count consecutive days backwards
  while (completionDates.has(checkDate.getTime())) {
    streak++;
    checkDate = subDays(checkDate, 1);
  }

  return streak;
}


export function SummaryCards({ tasks, habits, transactions }: SummaryCardsProps) {
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const habitsCompletedToday = habits.filter(habit => habit.type === 'build' && habit.completions.some(c => isToday(parseISO(c)))).length;
  const buildHabits = habits.filter(h => h.type === 'build');

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const longestStreak = Math.max(0, ...habits.map(getHabitStreak));

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingTasks}</div>
          <p className="text-xs text-muted-foreground">Tasks waiting for you</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Habits Today</CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{habitsCompletedToday} / {buildHabits.length}</div>
          <p className="text-xs text-muted-foreground">Habits completed today</p>
        </CardContent>
      </Card>
        <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak} days</div>
          <p className="text-xs text-muted-foreground">Your best habit streak</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-positive' : 'text-destructive'}`}>
            {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
          </div>
          <p className="text-xs text-muted-foreground">Your current financial status</p>
        </CardContent>
      </Card>
    </div>
  );
}
