/**
 * Core types for Wagmi-Lab Telegram Bot
 */

export interface Community {
  id: string;
  name: string;
  chatId: string;
  description: string;
  emoji: string;
  links: CommunityLinks;
  scheduledMessages: ScheduledMessage[];
  enabled: boolean;
}

export interface CommunityLinks {
  telegram?: string;
  website?: string;
  twitter?: string;
  discord?: string;
  github?: string;
  docs?: string;
}

export interface ScheduledMessage {
  id: string;
  communityId: string;
  cronExpression: string;
  messages: string[]; // Array of messages to rotate
  currentIndex: number;
  enabled: boolean;
  lastSent?: Date;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables?: Record<string, string>;
}

export interface BotContext {
  currentCommunity?: string;
  navigationHistory: string[];
}

export interface BotConfig {
  token: string;
  environment: 'development' | 'production';
  logLevel: string;
  timezone: string;
  botName: string;
  botUsername: string;
}

export enum CallbackAction {
  SHOW_COMMUNITIES = 'show_communities',
  SELECT_COMMUNITY = 'select_community',
  COMMUNITY_INFO = 'community_info',
  GO_TO_CHANNEL = 'go_to_channel',
  BACK_TO_MENU = 'back_to_menu',
  SHOW_LINKS = 'show_links',
}

export interface CallbackData {
  action: CallbackAction;
  communityId?: string;
  extra?: string;
}
