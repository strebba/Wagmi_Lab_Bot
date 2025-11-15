import { validateConfig } from './config/bot.config';
import { logger } from './utils/logger';
import { createBot, startBot } from './bot';
import { SchedulerService } from './services/scheduler/scheduler.service';

/**
 * Main entry point for the Wagmi-Lab Telegram Bot
 */
async function main() {
  try {
    logger.info('Starting Wagmi-Lab Telegram Bot...');

    // Validate configuration
    validateConfig();
    logger.info('Configuration validated successfully');

    // Create bot instance
    const bot = createBot();

    // Initialize scheduler service
    const schedulerService = new SchedulerService(bot);
    schedulerService.initialize();

    // Start bot
    await startBot(bot);

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      // Stop scheduler
      schedulerService.stopAll();

      // Stop bot
      bot.stop(signal);

      logger.info('Shutdown complete');
      process.exit(0);
    };

    process.once('SIGINT', () => shutdown('SIGINT'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error('Fatal error during bot startup:', error);
    process.exit(1);
  }
}

// Start the application
main();
