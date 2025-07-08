"use client";

import { useState } from 'react';
import { breakdownGoal } from '@/ai/flows/breakdown-goal-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface AiGoalBreakdownProps {
  onTasksGenerated: (tasks: string[]) => void;
}

export function AiGoalBreakdown({ onTasksGenerated }: AiGoalBreakdownProps) {
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBreakdown = async () => {
    if (!goal.trim()) {
      toast({
        title: "Goal is empty",
        description: "Please enter a goal to break down.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await breakdownGoal({ goal });
      onTasksGenerated(result.subTasks);
      setGoal('');
      toast({
        title: "Tasks generated!",
        description: "Your goal has been broken down into smaller tasks.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not break down the goal. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 hover:shadow-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">AI-Powered Goal Breakdown</CardTitle>
        </div>
        <CardDescription>Have a big goal? Let Prism break it down into manageable tasks for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input 
            id="goal"
            placeholder="e.g., Plan a trip to Japan" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => { if (e.key === 'Enter') handleBreakdown() }}
          />
          <Button onClick={handleBreakdown} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? 'Generating...' : 'Break it Down'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
