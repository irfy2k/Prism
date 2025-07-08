"use client";

import { cn } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id:string) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const dueDate = new Date(task.dueDate);
  const isOverdue = !task.completed && isPast(dueDate) && !isToday(dueDate);

  return (
    <div className={cn(
      "flex items-center gap-4 p-3 rounded-lg transition-colors",
      task.completed ? 'bg-muted/50' : 'bg-card hover:bg-muted/50',
      isOverdue ? 'border-l-4 border-destructive' : 'border-l-4 border-transparent'
    )}>
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
        aria-label={`Mark task "${task.content}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />
      <div className="flex-grow">
        <label
          htmlFor={`task-${task.id}`}
          className={cn(
            'font-medium transition-colors',
            task.completed ? 'line-through text-muted-foreground' : 'text-foreground'
          )}
        >
          {task.content}
        </label>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          <Calendar className="h-3 w-3" />
          <span className={cn(isOverdue && 'text-destructive font-medium')}>
            {format(dueDate, 'MMM d, yyyy')}
          </span>
          <Badge className={cn('text-xs', priorityColors[task.priority])}>{task.priority}</Badge>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        aria-label={`Delete task "${task.content}"`}
        className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
