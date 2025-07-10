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
import { PlusCircle } from 'lucide-react';
import { AddHabitSchema, Habit } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddHabitDialogProps {
  onAddHabit: (habit: Omit<Habit, 'id' | 'completions'>) => void;
}

export function AddHabitDialog({ onAddHabit }: AddHabitDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof AddHabitSchema>>({
    resolver: zodResolver(AddHabitSchema),
    defaultValues: {
      name: '',
      frequency: 'daily',
      type: 'build',
    },
  });

  const onSubmit = (values: z.infer<typeof AddHabitSchema>) => {
    onAddHabit(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new habit</DialogTitle>
          <DialogDescription>
            What new routine do you want to build or break?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <RadioGroup
              defaultValue={form.getValues('type')}
              onValueChange={(value: 'build' | 'break') => form.setValue('type', value)}
              className="col-span-3 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="build" id="build" />
                <Label htmlFor="build">Build</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="break" id="break" />
                <Label htmlFor="break">Break</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Habit
            </Label>
            <Input id="name" {...form.register('name')} className="col-span-3" placeholder="e.g. Drink water, No junk food" />
            {form.formState.errors.name && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select onValueChange={(value: 'daily' | 'weekly') => form.setValue('frequency', value)} defaultValue={form.getValues('frequency')}>
              <SelectTrigger className="col-span-3" id="frequency" name="frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Add Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
