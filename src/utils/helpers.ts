import { CallbackData, CallbackAction } from '../types';

/**
 * Utility functions for the bot
 */

/**
 * Encode callback data to string for inline keyboard
 */
export function encodeCallbackData(data: CallbackData): string {
  return JSON.stringify(data);
}

/**
 * Decode callback data from string
 */
export function decodeCallbackData(data: string): CallbackData {
  try {
    return JSON.parse(data);
  } catch (error) {
    return { action: CallbackAction.BACK_TO_MENU };
  }
}

/**
 * Escape markdown special characters
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

/**
 * Format date to Italian locale
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
