import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/types';
import { logger } from '../../utils/logger';
import { decodeCallbackData } from '../../utils/helpers';
import { CallbackAction } from '../../types';
import { getCommunityById } from '../../config/communities';
import {
  getMainMenuKeyboard,
  getCommunitiesKeyboard,
  getCommunityKeyboard,
} from '../keyboards/main.keyboard';

/**
 * Handle callback queries from inline keyboards
 */
export async function handleCallback(ctx: Context) {
  try {
    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;
    if (!callbackQuery.data) return;

    const data = decodeCallbackData(callbackQuery.data);

    logger.info('Callback received', {
      action: data.action,
      communityId: data.communityId,
      userId: ctx.from?.id,
    });

    switch (data.action) {
      case CallbackAction.SHOW_COMMUNITIES:
        await handleShowCommunities(ctx);
        break;

      case CallbackAction.SELECT_COMMUNITY:
        if (data.communityId) {
          await handleSelectCommunity(ctx, data.communityId);
        }
        break;

      case CallbackAction.COMMUNITY_INFO:
        if (data.communityId) {
          await handleCommunityInfo(ctx, data.communityId);
        }
        break;

      case CallbackAction.SHOW_LINKS:
        if (data.communityId) {
          await handleShowLinks(ctx, data.communityId);
        }
        break;

      case CallbackAction.BACK_TO_MENU:
        await handleBackToMenu(ctx);
        break;

      default:
        await ctx.answerCbQuery('Azione non riconosciuta');
    }

    await ctx.answerCbQuery();
  } catch (error) {
    logger.error('Error in handleCallback:', error);
    await ctx.answerCbQuery('Si è verificato un errore');
  }
}

/**
 * Show communities list
 */
async function handleShowCommunities(ctx: Context) {
  const message = `
🏛️ *Community Wagmi-Lab*

Seleziona una community per vedere maggiori informazioni e link utili:
  `.trim();

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: getCommunitiesKeyboard(),
  });
}

/**
 * Select a community
 */
async function handleSelectCommunity(ctx: Context, communityId: string) {
  const community = getCommunityById(communityId);

  if (!community) {
    await ctx.answerCbQuery('Community non trovata');
    return;
  }

  const message = `
${community.emoji} *${community.name}*

${community.description}

Usa i pulsanti qui sotto per esplorare:
  `.trim();

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: getCommunityKeyboard(communityId),
  });
}

/**
 * Show community info
 */
async function handleCommunityInfo(ctx: Context, communityId: string) {
  const community = getCommunityById(communityId);

  if (!community) {
    await ctx.answerCbQuery('Community non trovata');
    return;
  }

  const scheduledCount = community.scheduledMessages.filter((m) => m.enabled).length;

  const message = `
📊 *Info ${community.name}*

${community.emoji} *Nome:* ${community.name}
📝 *Descrizione:* ${community.description}
⏰ *Messaggi programmati:* ${scheduledCount}
✅ *Stato:* ${community.enabled ? 'Attiva' : 'Non attiva'}

La community riceve aggiornamenti automatici regolari!
  `.trim();

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: getCommunityKeyboard(communityId),
  });
}

/**
 * Show community links
 */
async function handleShowLinks(ctx: Context, communityId: string) {
  const community = getCommunityById(communityId);

  if (!community) {
    await ctx.answerCbQuery('Community non trovata');
    return;
  }

  const { links } = community;
  let linksList = '';

  if (links.telegram) linksList += `\n• [📱 Telegram](${links.telegram})`;
  if (links.website) linksList += `\n• [🌐 Website](${links.website})`;
  if (links.twitter) linksList += `\n• [🐦 Twitter](${links.twitter})`;
  if (links.discord) linksList += `\n• [💬 Discord](${links.discord})`;
  if (links.github) linksList += `\n• [⚙️ GitHub](${links.github})`;
  if (links.docs) linksList += `\n• [📚 Documentazione](${links.docs})`;

  const message = `
🔗 *Links ${community.name}*
${linksList}

Clicca sui link per visitare le varie piattaforme!
  `.trim();

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: getCommunityKeyboard(communityId),
    link_preview_options: { is_disabled: true },
  });
}

/**
 * Back to main menu
 */
async function handleBackToMenu(ctx: Context) {
  const message = `
🏠 *Menu Principale*

Benvenuto nel menu principale di Wagmi-Lab!
Usa i pulsanti qui sotto per navigare:
  `.trim();

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: getMainMenuKeyboard(),
  });
}
