"use client";

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Task } from '@/lib/types';
import { AddTaskDialog } from './add-task-dialog';
import { TaskItem } from './task-item';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AiGoalBreakdown } from './ai-goal-breakdown';
import { addDays, addWeeks, addMonths } from 'date-fns';

export function TasksTab() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleAiTasksGenerated = (taskContents: string[]) => {
    const newTasks = taskContents.map(content => ({
        content: content,
        dueDate: new Date().toISOString(),
        priority: 'medium' as const,
        recurrence: 'none' as const,
    }));
    newTasks.forEach(task => addTask(task));
  };

  const toggleTask = (id: string) => {
    let taskToToggle: Task | undefined;
    
    // First, update the completion status
    const newTasks = tasks.map(task => {
        if (task.id === id) {
          taskToToggle = { ...task, completed: !task.completed };
          return { ...task, completed: !task.completed };
        }
        return task;
      });

    // Handle recurrence if task is being marked as complete
    if (taskToToggle && taskToToggle.completed && taskToToggle.recurrence !== 'none') {
        const getNextDueDate = (dueDate: string, recurrence: Task['recurrence']) => {
            const date = new Date(dueDate);
            switch (recurrence) {
                case 'daily': return addDays(date, 1);
                case 'weekly': return addWeeks(date, 1);
                case 'monthly': return addMonths(date, 1);
                default: return date;
            }
        };

        const nextTask: Task = {
            ...taskToToggle,
            id: crypto.randomUUID(),
            dueDate: getNextDueDate(taskToToggle.dueDate, taskToToggle.recurrence).toISOString(),
            completed: false,
        };
        newTasks.push(nextTask);
    }

    setTasks(newTasks);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const pendingTasks = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completedTasks = tasks.filter(t => t.completed).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return (
    <div className="space-y-6">
      <AiGoalBreakdown onTasksGenerated={handleAiTasksGenerated} />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Tasks</CardTitle>
          <AddTaskDialog onAddTask={addTask} />
        </CardHeader>
        <CardContent className="space-y-6">
          {tasks.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <p>You have no tasks yet.</p>
              <p>Click the "Add Task" button or use the AI Goal Breakdown to get started!</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Pending</h3>
                {pendingTasks.length > 0 ? (
                  <div className="space-y-2">
                    {pendingTasks.map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No pending tasks. Great job!</p>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 border-t pt-4">Completed</h3>
                {completedTasks.length > 0 ? (
                  <div className="space-y-2">
                    {completedTasks.map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks completed yet.</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
