import { Community } from '../types';

/**
 * Community configurations for Wagmi-Lab
 * Add or modify communities here
 */
export const communities: Community[] = [
  {
    id: 'wagmi-defi',
    name: 'Wagmi DeFi',
    chatId: '-1002074466991',
    description: 'Community principale DeFi di Wagmi-Lab',
    emoji: '💎',
    links: {
      telegram: 'https://t.me/wagmi_defi',
      website: 'https://wagmi-lab.io',
      twitter: 'https://twitter.com/wagmi_lab',
      docs: 'https://docs.wagmi-lab.io',
    },
    scheduledMessages: [
      {
        id: 'daily-morning',
        communityId: 'wagmi-defi',
        cronExpression: '0 9 * * *', // Every day at 9:00 AM
        messages: [
          '🌅 Buongiorno Wagmi Family!\n\nIniziamo la giornata con energia! 💪\n\n📊 Resta aggiornato sulle ultime novità DeFi\n🔗 [Visita il nostro sito](https://wagmi-lab.io)',
          '☀️ Good morning!\n\nUn nuovo giorno, nuove opportunità nel mondo DeFi! 🚀\n\n💡 Continua a imparare e crescere con noi\n🔗 [Documentazione](https://docs.wagmi-lab.io)',
        ],
        currentIndex: 0,
        enabled: true,
      },
    ],
    enabled: true,
  },
  {
    id: 'wagmi-nft',
    name: 'Wagmi NFT',
    chatId: '', // Add your chat ID here
    description: 'Community NFT e Digital Art',
    emoji: '🎨',
    links: {
      telegram: 'https://t.me/wagmi_nft',
      website: 'https://wagmi-lab.io/nft',
      twitter: 'https://twitter.com/wagmi_lab',
    },
    scheduledMessages: [
      {
        id: 'weekly-recap',
        communityId: 'wagmi-nft',
        cronExpression: '0 18 * * 5', // Every Friday at 6:00 PM
        messages: [
          '🎨 Weekly NFT Recap!\n\nÈ tempo di fare il punto della settimana! 📊\n\n✨ Nuove collezioni\n🔥 Trending artists\n\n🔗 [Scopri di più](https://wagmi-lab.io/nft)',
        ],
        currentIndex: 0,
        enabled: true,
      },
    ],
    enabled: true,
  },
  {
    id: 'wagmi-dev',
    name: 'Wagmi Developers',
    chatId: '', // Add your chat ID here
    description: 'Community per sviluppatori e builders',
    emoji: '⚡',
    links: {
      telegram: 'https://t.me/wagmi_dev',
      github: 'https://github.com/wagmi-lab',
      docs: 'https://docs.wagmi-lab.io/developers',
    },
    scheduledMessages: [
      {
        id: 'tech-tuesday',
        communityId: 'wagmi-dev',
        cronExpression: '0 15 * * 2', // Every Tuesday at 3:00 PM
        messages: [
          '👨‍💻 Tech Tuesday!\n\nOggi parliamo di sviluppo e innovazione! 🚀\n\n📚 [Documentazione tecnica](https://docs.wagmi-lab.io/developers)\n💻 [GitHub](https://github.com/wagmi-lab)',
        ],
        currentIndex: 0,
        enabled: true,
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
