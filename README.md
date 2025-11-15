# Wagmi-Lab Telegram Bot

Bot Telegram ufficiale per le community Wagmi-Lab con supporto multi-community, messaggi ricorrenti e navigazione interattiva.

## Features

- **Multi-Community Management**: Gestione di più community Wagmi-Lab con configurazione dedicata
- **Messaggi Ricorrenti**: Sistema di scheduler con cron jobs per messaggi automatici
- **Navigazione Interattiva**: Inline keyboard per navigare tra le community
- **Link Support**: Supporto completo per link nei messaggi (Telegram, Website, Twitter, etc.)
- **Logging Avanzato**: Sistema di logging strutturato con Winston
- **Docker Ready**: Configurazione Docker completa per deployment facile
- **TypeScript**: Codebase completamente tipizzato per maggiore manutenibilità
- **Scalabile**: Architettura modulare per aggiungere facilmente nuove funzionalità

## Requisiti

- Node.js >= 20.0.0
- npm o yarn
- Un Bot Token di Telegram (da [@BotFather](https://t.me/BotFather))

## Installazione

### 1. Clone del repository

```bash
git clone <repository-url>
cd wagmi-lab-bot
```

### 2. Installazione dipendenze

```bash
npm install
```

### 3. Configurazione

Copia il file `.env.example` in `.env`:

```bash
cp .env.example .env
```

Modifica `.env` con le tue configurazioni:

```env
BOT_TOKEN=your_telegram_bot_token_here
NODE_ENV=development
LOG_LEVEL=info
TZ=Europe/Rome
BOT_NAME=Wagmi Lab Bot
BOT_USERNAME=wagmi_lab_bot
```

### 4. Configurazione Community

Modifica il file `src/config/communities.ts` per aggiungere/modificare le tue community:

```typescript
{
  id: 'wagmi-defi',
  name: 'Wagmi DeFi',
  chatId: 'YOUR_CHAT_ID', // Aggiungi il chat ID della tua community
  description: 'Community principale DeFi',
  emoji: '💎',
  links: {
    telegram: 'https://t.me/wagmi_defi',
    website: 'https://wagmi-lab.io',
    // ...
  },
  scheduledMessages: [
    {
      id: 'daily-morning',
      cronExpression: '0 9 * * *', // Ogni giorno alle 9:00
      messages: [
        'Messaggio 1',
        'Messaggio 2',
      ],
      enabled: true,
    },
  ],
  enabled: true,
}
```

## Come ottenere il Chat ID

Per ottenere il Chat ID della tua community:

1. Aggiungi il bot alla tua community
2. Invia un messaggio nella community
3. Visita: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Cerca il campo `chat.id` nella risposta

## Sviluppo

### Avvio in modalità development

```bash
npm run dev
```

Questo comando avvia il bot con hot reload usando `tsx watch`.

### Build del progetto

```bash
npm run build
```

### Linting e Formatting

```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Produzione

### Avvio diretto

```bash
npm run build
npm start
```

### Con Docker

#### Build e avvio con Docker Compose

```bash
# Build dell'immagine
npm run docker:build

# Avvio del container
npm run docker:run

# Oppure manualmente:
docker-compose up -d

# Visualizza i logs
docker-compose logs -f

# Stop del container
docker-compose down
```

#### Build Docker manuale

```bash
docker build -t wagmi-lab-bot .
docker run -d --env-file .env wagmi-lab-bot
```

## Deployment su Digital Ocean

### Opzione 1: App Platform (Consigliato)

1. Crea un nuovo repository GitHub con il codice
2. Vai su [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
3. Click su "Create App"
4. Seleziona il tuo repository GitHub
5. Configura le environment variables:
   - `BOT_TOKEN`: Il tuo bot token
   - `NODE_ENV`: `production`
   - Altre variabili necessarie
6. Deploy!

**Vantaggi:**
- Auto-scaling
- Zero-downtime deployments
- Deploy automatico da Git
- Managed infrastructure

### Opzione 2: Droplet con Docker

1. Crea un Droplet su Digital Ocean (Ubuntu 22.04 consigliato)
2. Installa Docker e Docker Compose sul Droplet:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. Copia i file sul Droplet:

```bash
scp -r ./* root@your-droplet-ip:/opt/wagmi-lab-bot/
```

4. SSH nel Droplet e avvia il bot:

```bash
ssh root@your-droplet-ip
cd /opt/wagmi-lab-bot
docker-compose up -d
```

### Script di Deployment Automatico

```bash
./scripts/deploy-digital-ocean.sh
```

## Struttura del Progetto

```
wagmi-lab-bot/
├── src/
│   ├── bot/                    # Bot core
│   │   ├── handlers/           # Command & callback handlers
│   │   ├── keyboards/          # Inline keyboards
│   │   ├── middleware/         # Middleware (logging, errors)
│   │   └── index.ts           # Bot initialization
│   ├── services/
│   │   └── scheduler/         # Scheduler service
│   ├── config/                # Configuration files
│   ├── types/                 # TypeScript types
│   └── utils/                 # Utility functions
├── tests/                     # Tests
├── scripts/                   # Deployment scripts
├── logs/                      # Log files
└── dist/                      # Compiled JavaScript
```

## Configurazione Messaggi Ricorrenti

I messaggi ricorrenti usano espressioni cron. Esempi:

```typescript
'0 9 * * *'      // Ogni giorno alle 9:00
'0 18 * * 5'     // Ogni venerdì alle 18:00
'0 */6 * * *'    // Ogni 6 ore
'0 12 * * 1-5'   // Ogni giorno lavorativo a mezzogiorno
```

Generatore cron: [crontab.guru](https://crontab.guru/)

## Comandi Bot

- `/start` - Avvia il bot e mostra il menu principale
- `/help` - Mostra la guida ai comandi
- `/communities` - Mostra tutte le community

## Aggiungere Nuove Funzionalità

### Aggiungere un nuovo comando

1. Crea un handler in `src/bot/handlers/commands.ts`:

```typescript
export async function handleMyCommand(ctx: Context) {
  await ctx.reply('My new command!');
}
```

2. Registra il comando in `src/bot/index.ts`:

```typescript
bot.command('mycommand', handleMyCommand);
```

### Aggiungere una nuova community

Modifica `src/config/communities.ts` e aggiungi la configurazione della community.

### Aggiungere un nuovo servizio

1. Crea una cartella in `src/services/`
2. Implementa il servizio
3. Inizializzalo in `src/index.ts`

## Troubleshooting

### Il bot non risponde

- Verifica che il `BOT_TOKEN` sia corretto
- Controlla i logs: `docker-compose logs -f` o `logs/combined.log`
- Verifica che il bot sia stato avviato correttamente

### I messaggi ricorrenti non vengono inviati

- Verifica che il `chatId` sia configurato correttamente
- Controlla che il bot sia admin della community (per inviare messaggi)
- Verifica l'espressione cron: `cron.validate('0 9 * * *')`
- Controlla il timezone in `.env`

### Errori di permessi

- Assicurati che il bot abbia i permessi necessari nella community
- Il bot deve essere admin per inviare messaggi

## Sicurezza

- Non committare mai il file `.env` (è già in `.gitignore`)
- Usa environment variables per dati sensibili
- Mantieni aggiornate le dipendenze: `npm audit`
- In produzione, usa sempre HTTPS per webhook (se implementati)

## Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

MIT License - vedi il file LICENSE per dettagli

## Supporto

Per supporto, apri una issue su GitHub o contatta il team Wagmi-Lab.

## Crediti

Sviluppato con da Wagmi-Lab Team

---

**Wagmi to the moon!** 🚀
