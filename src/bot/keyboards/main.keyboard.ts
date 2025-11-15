import { InlineKeyboardMarkup } from 'telegraf/types';
import { CallbackAction } from '../../types';
import { encodeCallbackData } from '../../utils/helpers';
import { getEnabledCommunities } from '../../config/communities';

/**
 * Main menu keyboard
 */
export function getMainMenuKeyboard(): InlineKeyboardMarkup {
  return {
    inline_keyboard: [
      [
        {
          text: '🏛️ Le nostre Community',
          callback_data: encodeCallbackData({ action: CallbackAction.SHOW_COMMUNITIES }),
        },
      ],
    ],
  };
}

/**
 * Communities list keyboard
 */
export function getCommunitiesKeyboard(): InlineKeyboardMarkup {
  const communities = getEnabledCommunities();

  const buttons = communities.map((community) => [
    {
      text: `${community.emoji} ${community.name}`,
      callback_data: encodeCallbackData({
        action: CallbackAction.SELECT_COMMUNITY,
        communityId: community.id,
      }),
    },
  ]);

  // Add back button
  buttons.push([
    {
      text: '⬅️ Torna al Menu',
      callback_data: encodeCallbackData({ action: CallbackAction.BACK_TO_MENU }),
    },
  ]);

  return { inline_keyboard: buttons };
}

/**
 * Community detail keyboard
 */
export function getCommunityKeyboard(communityId: string): InlineKeyboardMarkup {
  const buttons = [
    [
      {
        text: '📊 Info Community',
        callback_data: encodeCallbackData({
          action: CallbackAction.COMMUNITY_INFO,
          communityId,
        }),
      },
    ],
    [
      {
        text: '🔗 Links Utili',
        callback_data: encodeCallbackData({
          action: CallbackAction.SHOW_LINKS,
          communityId,
        }),
      },
    ],
    [
      {
        text: '⬅️ Torna alle Community',
        callback_data: encodeCallbackData({ action: CallbackAction.SHOW_COMMUNITIES }),
      },
    ],
  ];

  return { inline_keyboard: buttons };
}
