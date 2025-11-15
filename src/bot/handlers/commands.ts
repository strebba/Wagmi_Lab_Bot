import { Context } from 'telegraf';
import { logger } from '../../utils/logger';
import { getMainMenuKeyboard } from '../keyboards/main.keyboard';
import { botConfig } from '../../config/bot.config';

/**
 * Handle /start command
 */
export async function handleStart(ctx: Context) {
  try {
    const username = ctx.from?.username || ctx.from?.first_name || 'there';

    const welcomeMessage = `
🚀 *Benvenuto in ${botConfig.botName}!*

Ciao ${username}! 👋

Sono il bot ufficiale delle community Wagmi-Lab.
Qui puoi:

• 🏛️ Esplorare le nostre community
• 📰 Ricevere aggiornamenti e news
• 🔗 Accedere a risorse utili
• 💬 Interagire con la famiglia Wagmi

Usa i pulsanti qui sotto per iniziare! 👇
    `.trim();

    await ctx.reply(welcomeMessage, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(),
    });

    logger.info('Start command executed', {
      userId: ctx.from?.id,
      username: ctx.from?.username,
    });
  } catch (error) {
    logger.error('Error in handleStart:', error);
    await ctx.reply('Si è verificato un errore. Riprova più tardi.');
  }
}

/**
 * Handle /help command
 */
export async function handleHelp(ctx: Context) {
  try {
    const helpMessage = `
📚 *Guida ai Comandi*

*Comandi disponibili:*
/start - Avvia il bot e mostra il menu principale
/help - Mostra questo messaggio di aiuto
/communities - Mostra tutte le community Wagmi-Lab

*Come usare il bot:*
1️⃣ Usa i pulsanti per navigare tra le community
2️⃣ Clicca su una community per vedere info e link
3️⃣ Riceverai aggiornamenti automatici nelle community

*Hai bisogno di supporto?*
Contatta gli admin della tua community! 💪
    `.trim();

    await ctx.reply(helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: getMainMenuKeyboard(),
    });

    logger.info('Help command executed', {
      userId: ctx.from?.id,
    });
  } catch (error) {
    logger.error('Error in handleHelp:', error);
    await ctx.reply('Si è verificato un errore. Riprova più tardi.');
  }
}

/**
 * Handle /communities command
 */
export async function handleCommunities(ctx: Context) {
  try {
    const { getCommunitiesKeyboard } = await import('../keyboards/main.keyboard');

    const message = `
🏛️ *Community Wagmi-Lab*

Seleziona una community per vedere maggiori informazioni:
    `.trim();

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: getCommunitiesKeyboard(),
    });

    logger.info('Communities command executed', {
      userId: ctx.from?.id,
    });
  } catch (error) {
    logger.error('Error in handleCommunities:', error);
    await ctx.reply('Si è verificato un errore. Riprova più tardi.');
  }
}
