import { Community } from '../types';

/**
 * Community configurations for Wagmi-Lab
 * Add or modify communities here
 */
export const communities: Community[] = [
  {
    id: 'wagmi-crypto-community',
    name: 'WAGMI - Crypto Community',
    chatId: '-1002074466991',
    description: 'Crypto Community',
    emoji: '🌐',
    links: {
      telegram: 'https://t.me/Wagmi_community',
      website: 'https://wagmi-lab.com',
    },
    scheduledMessages: [
      {
        id: 'daily-morning',
        communityId: 'wagmi-crypto-community',
        cronExpression: '0 9 * * *', // Every day at 9:00 AM
        messages: [
          '🌅 *Buongiorno Crypto Community!*\n\nIniziamo la giornata con le ultime news crypto! 💪\n\n📊 Resta aggiornato sul mercato\n💬 [Unisciti alla Community](https://t.me/Wagmi_community)\n🌐 [Visita il sito](https://wagmi-lab.com)',
          '☀️ *Good morning Crypto Fam!*\n\nUn nuovo giorno, nuove opportunità nel mondo crypto! 🚀\n\n💡 Stay informed, stay ahead\n💬 [Join the Community](https://t.me/Wagmi_community)\n🌐 [Website](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: true,
      },
    ],
    enabled: true,
  },
  {
    id: 'wagmi-trading-club',
    name: 'WAGMI - Trading Club',
    chatId: '', // Add your chat ID here
    description: 'Trading Club',
    emoji: '📈',
    links: {
      telegram: 'https://t.me/+GoDQ-tcq99UyMDk0',
      website: 'https://wagmi-lab.com',
    },
    scheduledMessages: [
      {
        id: 'market-analysis',
        communityId: 'wagmi-trading-club',
        cronExpression: '0 8 * * 1-5', // Every weekday at 8:00 AM
        messages: [
          '📈 *Buongiorno Traders!*\n\nPronti per una nuova giornata di trading! 💼\n\n📊 Analisi di mercato in arrivo\n💬 [Unisciti al Trading Club](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Website](https://wagmi-lab.com)',
          '💹 *Morning Trading Alert!*\n\nMarkets are opening, stay sharp! ⚡\n\n📉 Monitor your positions\n💬 [Join Trading Club](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Website](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: false, // Disabled until Chat ID is configured
      },
    ],
    enabled: true,
  },
];

export function getCommunityById(id: string): Community | undefined {
  return communities.find((c) => c.id === id);
}

export function getEnabledCommunities(): Community[] {
  return communities.filter((c) => c.enabled);
}

export function getCommunityByChatId(chatId: string): Community | undefined {
  return communities.find((c) => c.chatId === chatId);
}
