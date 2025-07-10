"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { AddTaskSchema, Task } from '@/lib/types';
import { safeParseDate, isValidDate } from '@/lib/utils';

interface AddTaskDialogProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof AddTaskSchema>>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      content: '',
      dueDate: new Date().toISOString(),
      priority: 'medium',
      recurrence: 'none',
    },
  });

  const onSubmit = (values: z.infer<typeof AddTaskSchema>) => {
    onAddTask(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new task</DialogTitle>
          <DialogDescription>
            What do you need to get done?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Task
            </Label>
            <Input id="content" {...form.register('content')} className="col-span-3" />
            {form.formState.errors.content && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.content.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="col-span-3 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {(() => {
                    try {
                      const dateValue = form.watch('dueDate');
                      return isValidDate(dateValue) ? format(safeParseDate(dateValue), 'PPP') : 'Select date';
                    } catch (error) {
                      return 'Select date';
                    }
                  })()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={(() => {
                    try {
                      const dateValue = form.watch('dueDate');
                      return isValidDate(dateValue) ? safeParseDate(dateValue) : undefined;
                    } catch (error) {
                      return undefined;
                    }
                  })()}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue('dueDate', date.toISOString());
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select onValueChange={(value: 'low' | 'medium' | 'high') => form.setValue('priority', value)} defaultValue={form.getValues('priority')}>
              <SelectTrigger className="col-span-3" id="priority" name="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurrence" className="text-right">
              Repeats
            </Label>
            <Select onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => form.setValue('recurrence', value)} defaultValue={form.getValues('recurrence')}>
              <SelectTrigger className="col-span-3" id="recurrence" name="recurrence">
                <SelectValue placeholder="Select recurrence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
