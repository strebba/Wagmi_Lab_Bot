import { Telegraf } from 'telegraf';
import { botConfig } from '../config/bot.config';
import { logger } from '../utils/logger';
import { handleStart, handleHelp, handleCommunities } from './handlers/commands';
import { handleCallback } from './handlers/callbacks';
import { loggerMiddleware } from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';

/**
 * Initialize and configure the Telegram bot
 */
export function createBot(): Telegraf {
  const bot = new Telegraf(botConfig.token);

  // Apply middleware
  bot.use(loggerMiddleware);

  // Register command handlers
  bot.command('start', handleStart);
  bot.command('help', handleHelp);
  bot.command('communities', handleCommunities);

  // Register callback query handler
  bot.on('callback_query', handleCallback);

  // Handle unknown commands
  bot.on('text', async (ctx) => {
    await ctx.reply('🤔 Comando non riconosciuto.\n\nUsa /help per vedere i comandi disponibili.');
  });

  // Error handling
  bot.catch(errorHandler);

  logger.info('Bot initialized successfully', {
    botName: botConfig.botName,
    environment: botConfig.environment,
  });

  return bot;
}

/**
 * Start the bot
 */
export async function startBot(bot: Telegraf): Promise<void> {
  try {
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    // Start bot
    await bot.launch();

    logger.info('Bot started successfully', {
      botName: botConfig.botName,
      username: botConfig.botUsername,
    });

    // eslint-disable-next-line no-console
    console.log(`✅ ${botConfig.botName} is running!`);
  } catch (error) {
    logger.error('Failed to start bot:', error);
    throw error;
  }
}

/**
 * Stop the bot gracefully
 */
export async function stopBot(bot: Telegraf): Promise<void> {
  logger.info('Stopping bot...');
  await bot.stop();
  logger.info('Bot stopped successfully');
}
