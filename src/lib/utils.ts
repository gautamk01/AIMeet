import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

//class name :- safefully combine the tailwind css
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
