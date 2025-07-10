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
import { AddTransactionSchema, Transaction } from '@/lib/types';

interface AddTransactionDialogProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export function AddTransactionDialog({ onAddTransaction }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof AddTransactionSchema>>({
    resolver: zodResolver(AddTransactionSchema),
    defaultValues: {
      type: 'expense',
      category: '',
      amount: 0,
      date: new Date().toISOString(),
    },
  });

  const onSubmit = (values: z.infer<typeof AddTransactionSchema>) => {
    onAddTransaction(values);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new transaction</DialogTitle>
          <DialogDescription>
            Record your income or expense.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select onValueChange={(value: 'income' | 'expense') => form.setValue('type', value)} defaultValue={form.getValues('type')}>
              <SelectTrigger className="col-span-3" id="type" name="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input 
              id="category" 
              {...form.register('category')} 
              className="col-span-3" 
              placeholder="e.g., Groceries, Salary" 
            />
            {form.formState.errors.category && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.category.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input 
              id="amount" 
              type="number" 
              step="0.01" 
              {...form.register('amount', { valueAsNumber: true })} 
              className="col-span-3" 
            />
            {form.formState.errors.amount && <p className="col-span-4 text-right text-xs text-destructive">{form.formState.errors.amount.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="col-span-3 justify-start text-left font-normal"
                  id="date"
                  name="date"
                  type="button"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(new Date(form.watch('date')), 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(form.watch('date'))}
                  onSelect={(date) => form.setValue('date', date?.toISOString() || '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="submit">Add Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
