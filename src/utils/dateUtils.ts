
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

/**
 * Format a date with the user's timezone
 */
export const formatDate = (date: Date | string, formatString: string = "PPP"): string => {
  if (!date) return "N/A";
  
  const dateObject = typeof date === "string" ? parseISO(date) : date;
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDate = toZonedTime(dateObject, userTimeZone);
  
  return format(zonedDate, formatString);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date: Date | string): string => {
  if (!date) return "N/A";
  
  const dateObject = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObject, { addSuffix: true });
};

/**
 * Format date for display in the application
 */
export const displayDate = (date: Date | string): string => {
  return formatDate(date, "PPPP");
};

/**
 * Format time for display in the application
 */
export const displayTime = (date: Date | string): string => {
  return formatDate(date, "p");
};

/**
 * Format date and time for display in the application
 */
export const displayDateTime = (date: Date | string): string => {
  return formatDate(date, "PPPp");
};
