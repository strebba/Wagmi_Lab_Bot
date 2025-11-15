# Quick Start Guide - Wagmi-Lab Bot

Guida rapida per iniziare a usare il bot in 5 minuti.

## Setup Veloce

### 1. Prerequisiti

```bash
# Verifica versione Node.js (deve essere >= 20)
node --version

# Se necessario, installa Node.js 20 LTS da https://nodejs.org/
```

### 2. Installazione

```bash
# Clone del progetto (se non già fatto)
# git clone <repository-url>
cd wagmi-lab-bot

# Installa dipendenze
npm install
```

### 3. Configurazione Bot Telegram

**Crea il bot su Telegram:**

1. Apri Telegram e cerca `@BotFather`
2. Invia `/newbot`
3. Segui le istruzioni:
   - Nome bot: `Wagmi Lab Bot` (o quello che preferisci)
   - Username: `wagmi_lab_bot` (deve essere unico)
4. Riceverai un token tipo: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
5. **COPIA E SALVA IL TOKEN!**

### 4. Configura Environment

```bash
# Copia il file .env.example
cp .env.example .env

# Modifica .env e aggiungi il tuo token
# Usa il tuo editor preferito (nano, vim, vscode, etc.)
nano .env
```

Nel file `.env`, modifica la riga:
```
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

Sostituisci con il TUO token ricevuto da BotFather.

### 5. Ottieni Chat ID delle Community

**Per ogni community dove vuoi il bot:**

1. Aggiungi il bot alla community Telegram
2. Rendilo admin (Settings → Administrators → Add Administrator)
3. Invia un messaggio nella community (tipo "ciao")
4. Ottieni il chat ID:

```bash
# Sostituisci YOUR_TOKEN con il tuo token
curl https://api.telegram.org/botYOUR_TOKEN/getUpdates
```

5. Cerca nell'output JSON il campo `"chat":{"id": -1001234567890}`
6. Copia il numero (es: `-1001234567890`)

### 6. Configura le Community

Apri `src/config/communities.ts` e modifica i `chatId`:

```typescript
{
  id: 'wagmi-defi',
  name: 'Wagmi DeFi',
  chatId: '-1001234567890', // ← Inserisci qui il tuo chat ID
  // ...resto configurazione
}
```

**Ripeti per ogni community che vuoi configurare.**

### 7. Personalizza i Messaggi (Opzionale)

Sempre in `src/config/communities.ts`, modifica i messaggi ricorrenti:

```typescript
scheduledMessages: [
  {
    id: 'daily-morning',
    cronExpression: '0 9 * * *', // Alle 9:00 ogni giorno
    messages: [
      '🌅 Buongiorno! Messaggio personalizzato...',
      '☀️ Secondo messaggio rotante...',
    ],
    enabled: true,
  },
]
```

**Espressioni Cron comuni:**
- `0 9 * * *` - Ogni giorno alle 9:00
- `0 18 * * 5` - Ogni venerdì alle 18:00
- `0 */6 * * *` - Ogni 6 ore
- Generatore: https://crontab.guru/

### 8. Avvia il Bot!

```bash
# Development mode (con hot reload)
npm run dev
```

Dovresti vedere:
```
✅ Wagmi Lab Bot is running!
```

### 9. Testa il Bot

1. Apri Telegram
2. Cerca il tuo bot (es: `@wagmi_lab_bot`)
3. Invia `/start`
4. Prova i bottoni!

---

## Comandi Utili

```bash
# Development (auto-restart on changes)
npm run dev

# Build for production
npm run build

# Run production
npm start

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format

# Run tests
npm test
```

---

## Troubleshooting Rapido

### Bot non risponde

**Problema:** Il bot non risponde ai comandi

**Soluzione:**
1. Verifica che il bot sia running (controlla i log)
2. Verifica il `BOT_TOKEN` in `.env`
3. Riavvia: `Ctrl+C` poi `npm run dev`

### Messaggi ricorrenti non vengono inviati

**Problema:** I messaggi programmati non vengono inviati

**Soluzioni:**
1. Verifica che il bot sia **admin** nella community
2. Verifica che il `chatId` sia corretto (con il `-`)
3. Controlla il cron expression su https://crontab.guru/
4. Controlla i log per errori

### Errore "BOT_TOKEN is required"

**Problema:** Errore all'avvio

**Soluzione:**
1. Verifica che `.env` esista
2. Verifica che `BOT_TOKEN=` sia compilato
3. Non lasciare spazi: `BOT_TOKEN=123456` ✅ non `BOT_TOKEN = 123456` ❌

### Il bot invia messaggi ma senza link cliccabili

**Problema:** I link appaiono come testo normale

**Soluzione:**
Assicurati di usare il formato Markdown corretto:
```
[Testo del link](https://url.com)
```

---

## Next Steps

### Vuoi deployare in produzione?

Leggi la guida completa: [DEPLOYMENT.md](DEPLOYMENT.md)

### Vuoi capire l'architettura?

Leggi: [ARCHITECTURE.md](ARCHITECTURE.md)

### Vuoi personalizzare di più?

Leggi il README completo: [README.md](README.md)

---

## Checklist Setup Completo

- [ ] Node.js 20+ installato
- [ ] Dipendenze installate (`npm install`)
- [ ] Bot creato su BotFather
- [ ] Token salvato in `.env`
- [ ] Bot aggiunto alle community
- [ ] Bot reso admin nelle community
- [ ] Chat ID ottenuti e configurati
- [ ] Messaggi personalizzati (opzionale)
- [ ] Bot testato (`/start`, bottoni)
- [ ] Messaggi ricorrenti testati (o verificati nei log)

---

## Support

Hai problemi?

1. Controlla i log nella console
2. Leggi [README.md](README.md) completo
3. Leggi [DEPLOYMENT.md](DEPLOYMENT.md) per il deploy
4. Contatta il team Wagmi-Lab

---

**Buon divertimento con il tuo bot!** 🚀
