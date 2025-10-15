// /lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Takes the Devpost prize string as input. It should use a regular expression 
 * or string manipulation to extract the currency symbol and the value, 
 * returning a clean string (e.g., '$10,000'). 
 * It should handle non-string inputs gracefully.
 */
export function cleanCurrencySpan(htmlString: string): string {
  if (typeof htmlString !== 'string') {
    return '';
  }
  
  // Remove HTML tags and extract only the text content
  // This will convert '$<span ...>10,000</span>' to '$10,000'
  return htmlString.replace(/<[^>]*>/g, '');
}

/**
 * Takes an image URL string. If it starts with //, prepend https: to it. 
 * Otherwise, return it as is.
 */
export function formatImageUrl(imageUrl: string): string {
  if (typeof imageUrl !== 'string') {
    return '';
  }
  
  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }
  
  return imageUrl;
}