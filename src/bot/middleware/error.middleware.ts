import { Context } from 'telegraf';
import { logger } from '../../utils/logger';

/**
 * Global error handler middleware
 */
export async function errorHandler(err: unknown, ctx: Context) {
  const error = err as Error;
  logger.error('Bot error occurred:', {
    error: error.message,
    stack: error.stack,
    update: ctx.update,
    userId: ctx.from?.id,
  });

  try {
    await ctx.reply(
      '❌ Si è verificato un errore imprevisto.\n\nRiprova più tardi o contatta un amministratore.'
    );
  } catch (replyError) {
    logger.error('Failed to send error message to user:', replyError);
  }
}
