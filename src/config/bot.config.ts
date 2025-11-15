import dotenv from 'dotenv';
import { BotConfig } from '../types';

dotenv.config();

export const botConfig: BotConfig = {
  token: process.env.BOT_TOKEN || '',
  environment: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  timezone: process.env.TZ || 'Europe/Rome',
  botName: process.env.BOT_NAME || 'Wagmi Lab Bot',
  botUsername: process.env.BOT_USERNAME || 'wagmi_lab_bot',
};

// Validate required configuration
export function validateConfig(): void {
  if (!botConfig.token) {
    throw new Error('BOT_TOKEN is required. Please set it in .env file');
  }
}
