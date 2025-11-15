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
        id: 'morning-update',
        communityId: 'wagmi-crypto-community',
        cronExpression: '0 9 * * *', // Every day at 9:00 AM
        messages: [
          '🌅 *Buongiorno Crypto Community!*\n\nIniziamo la giornata con energia! 💪\n\n📊 Mercati crypto aperti\n💡 Resta aggiornato con noi\n💬 [Community](https://t.me/Wagmi_community)\n🌐 [Website](https://wagmi-lab.com)',
          '☀️ *Good Morning Crypto Fam!*\n\nA new day in crypto! 🚀\n\n📈 Markets are moving\n💎 Stay informed, stay ahead\n💬 [Join us](https://t.me/Wagmi_community)\n🌐 [wagmi-lab.com](https://wagmi-lab.com)',
          '🌄 *Buongiorno Wagmi!*\n\nNuove opportunità oggi! ⚡\n\n🔥 Segui i trend\n🎯 Fai le mosse giuste\n💬 [Crypto Community](https://t.me/Wagmi_community)\n🌐 [Scopri di più](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: true,
      },
      {
        id: 'afternoon-check',
        communityId: 'wagmi-crypto-community',
        cronExpression: '0 15 * * *', // Every day at 3:00 PM
        messages: [
          '📊 *Market Check Pomeridiano*\n\nCome stanno andando i tuoi asset? 🤔\n\n💹 Analizza le posizioni\n🔍 Monitora i trend\n💬 [Discussioni Live](https://t.me/Wagmi_community)\n🌐 [Tools](https://wagmi-lab.com)',
          '⚡ *Afternoon Update*\n\nMarkets halfway through! 📈\n\n🎯 Check your portfolio\n📉 Adjust strategies\n💬 [Community Chat](https://t.me/Wagmi_community)\n🌐 [Resources](https://wagmi-lab.com)',
          '🔥 *Pomeriggio Crypto*\n\nVolumi in movimento! 💪\n\n📊 Opportunità in vista\n💡 Resta vigile\n💬 [Unisciti](https://t.me/Wagmi_community)\n🌐 [wagmi-lab.com](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: true,
      },
      {
        id: 'evening-recap',
        communityId: 'wagmi-crypto-community',
        cronExpression: '0 20 * * *', // Every day at 8:00 PM
        messages: [
          '🌙 *Recap Serale*\n\nCome è andata la giornata? 📊\n\n💰 Chiusure mercati\n📈 Analisi giornaliera\n💬 [Condividi insights](https://t.me/Wagmi_community)\n🌐 [News](https://wagmi-lab.com)',
          '✨ *Evening Wrap-Up*\n\nDaily summary time! 🎯\n\n📉 Market closes\n💡 Key takeaways\n💬 [Join discussion](https://t.me/Wagmi_community)\n🌐 [Updates](https://wagmi-lab.com)',
          '🌆 *Fine Giornata*\n\nPrepariamoci per domani! 💪\n\n🔮 Outlook serale\n📊 Dati del giorno\n💬 [Community](https://t.me/Wagmi_community)\n🌐 [Risorse](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: true,
      },
      {
        id: 'weekend-special',
        communityId: 'wagmi-crypto-community',
        cronExpression: '0 18 * * 0', // Every Sunday at 6:00 PM
        messages: [
          '🎯 *Weekend Crypto Recap*\n\nPrepariamoci alla settimana! 📅\n\n📊 Analisi settimanale\n💡 Setup per lunedì\n🔥 Top news del weekend\n💬 [Community](https://t.me/Wagmi_community)\n🌐 [wagmi-lab.com](https://wagmi-lab.com)',
          '🚀 *Sunday Preparation*\n\nWeek ahead preview! 📈\n\n📅 Market outlook\n💰 Key levels to watch\n🎯 Strategy planning\n💬 [Join us](https://t.me/Wagmi_community)\n🌐 [Website](https://wagmi-lab.com)',
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
        id: 'pre-market',
        communityId: 'wagmi-trading-club',
        cronExpression: '0 8 * * 1-5', // Weekdays at 8:00 AM
        messages: [
          '📈 *Pre-Market Alert*\n\nBuongiorno Traders! 💼\n\n🔔 Mercati in apertura\n📊 Setup del giorno\n⚡ Livelli chiave da monitorare\n💬 [Trading Club](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Tools](https://wagmi-lab.com)',
          '🎯 *Morning Trading Setup*\n\nReady to trade! 🚀\n\n📉 Key levels identified\n💰 Opportunities ahead\n🔥 High volume expected\n💬 [Join discussion](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Analysis](https://wagmi-lab.com)',
          '⚡ *Apertura Mercati*\n\nSiamo pronti! 💪\n\n📊 Analisi tecnica ready\n🎯 Target individuati\n💡 Strategy of the day\n💬 [Traders Club](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [wagmi-lab.com](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: false, // Disabled until Chat ID is configured
      },
      {
        id: 'mid-day-check',
        communityId: 'wagmi-trading-club',
        cronExpression: '0 12 * * 1-5', // Weekdays at 12:00 PM
        messages: [
          '🔔 *Mid-Day Check*\n\nMetà giornata! 📊\n\n💹 Come stanno le posizioni?\n📈 Aggiustamenti necessari?\n🎯 Take profit o hold?\n💬 [Live Chat](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Dashboard](https://wagmi-lab.com)',
          '⚡ *Lunch Break Update*\n\nHalfway there! 💼\n\n📉 Morning recap\n💰 P&L check\n🔥 Afternoon outlook\n💬 [Trading Room](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Resources](https://wagmi-lab.com)',
          '📊 *Metà Sessione*\n\nControllo posizioni! 🎯\n\n💡 Volume analysis\n📈 Trend confirmation\n⚡ Risk management\n💬 [Traders](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Charts](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: false,
      },
      {
        id: 'market-close',
        communityId: 'wagmi-trading-club',
        cronExpression: '0 18 * * 1-5', // Weekdays at 6:00 PM
        messages: [
          '🌆 *Market Close*\n\nChiusura mercati! 📊\n\n💰 Recap giornaliero\n📈 Performance del giorno\n🎯 Setup per domani\n💬 [Daily Debrief](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Results](https://wagmi-lab.com)',
          '✨ *Closing Bell*\n\nEnd of trading day! 💼\n\n📉 Winners & losers\n💡 Lessons learned\n🔥 Tomorrow\'s watchlist\n💬 [Join recap](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Analytics](https://wagmi-lab.com)',
          '🔔 *Fine Trading*\n\nMercati chiusi! ⚡\n\n📊 Statistiche giornata\n💹 Top movers\n🎯 Piano per domani\n💬 [Discussion](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Reports](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: false,
      },
      {
        id: 'weekly-review',
        communityId: 'wagmi-trading-club',
        cronExpression: '0 19 * * 5', // Friday at 7:00 PM
        messages: [
          '🎯 *Weekly Trading Review*\n\nRecap della settimana! 📅\n\n📊 Performance settimanale\n💰 Best trades\n📈 Lessons learned\n🔥 Next week outlook\n💬 [Weekend Chat](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Full Report](https://wagmi-lab.com)',
          '🚀 *Week Wrap-Up*\n\nFriday summary! 💼\n\n📈 Weekly P&L\n💡 Top strategies\n🎯 Market analysis\n⚡ Monday prep\n💬 [Traders Lounge](https://t.me/+GoDQ-tcq99UyMDk0)\n🌐 [Statistics](https://wagmi-lab.com)',
        ],
        currentIndex: 0,
        enabled: false,
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
