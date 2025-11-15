import { Context } from 'telegraf';
import { logger } from '../../utils/logger';
import { Update } from 'telegraf/types';

/**
 * Logging middleware for all updates
 */
export async function loggerMiddleware(ctx: Context, next: () => Promise<void>) {
  const start = Date.now();
  const update = ctx.update as Update;

  // Log incoming update
  logger.info('Incoming update', {
    updateType: getUpdateType(update),
    userId: ctx.from?.id,
    username: ctx.from?.username,
    chatId: ctx.chat?.id,
  });

  try {
    await next();

    // Log successful processing
    const duration = Date.now() - start;
    logger.info('Update processed successfully', {
      duration: `${duration}ms`,
      updateType: getUpdateType(update),
    });
  } catch (error) {
    // Error will be handled by error middleware
    const duration = Date.now() - start;
    logger.error('Update processing failed', {
      duration: `${duration}ms`,
      updateType: getUpdateType(update),
      error,
    });
    throw error;
  }
}

/**
 * Get the type of update
 */
function getUpdateType(update: Update): string {
  if ('message' in update) return 'message';
  if ('callback_query' in update) return 'callback_query';
  if ('inline_query' in update) return 'inline_query';
  if ('edited_message' in update) return 'edited_message';
  if ('channel_post' in update) return 'channel_post';
  return 'unknown';
}
