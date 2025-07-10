import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parse a date string and return a valid Date object
 * @param dateString - The date string to parse
 * @param fallback - Fallback date if parsing fails (defaults to current date)
 * @returns A valid Date object
 */
export function safeParseDate(
  dateString: string | null | undefined,
  fallback: Date = new Date()
): Date {
  if (!dateString) return fallback;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? fallback : date;
  } catch {
    return fallback;
  }
}

/**
 * Check if a date string is valid
 * @param dateString - The date string to validate
 * @returns True if the date is valid, false otherwise
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}
