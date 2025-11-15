# Architettura del Progetto - Wagmi-Lab Bot

Documentazione dell'architettura e delle scelte tecniche del bot Telegram.

## Indice

1. [Overview](#overview)
2. [Stack Tecnologico](#stack-tecnologico)
3. [Architettura del Codice](#architettura-del-codice)
4. [Pattern e Best Practices](#pattern-e-best-practices)
5. [Flussi Principali](#flussi-principali)
6. [Estensibilità](#estensibilità)

---

## Overview

Il Wagmi-Lab Bot è progettato seguendo i principi di **Clean Architecture** e **SOLID**, garantendo:

- **Manutenibilità**: Codice chiaro e ben organizzato
- **Scalabilità**: Facile aggiungere nuove funzionalità
- **Testabilità**: Componenti isolati e testabili
- **Type Safety**: TypeScript strict mode per ridurre bug
- **Separation of Concerns**: Ogni modulo ha una responsabilità specifica

---

## Stack Tecnologico

### Core

- **Runtime**: Node.js 20 LTS
  - Stabile, performante, supporto LTS
  - Compatibilità con latest features ECMAScript

- **Language**: TypeScript 5.x
  - Type safety per ridurre bug runtime
  - Intellisense migliorato
  - Refactoring sicuro

### Librerie Principali

- **Telegraf.js**: Framework Telegram Bot API
  - Wrapper elegante dell'API Telegram
  - Middleware pattern
  - Context-based handlers

- **node-cron**: Scheduler per messaggi ricorrenti
  - Sintassi cron standard
  - Timezone support
  - Lightweight e affidabile

- **Winston**: Structured logging
  - Logging multilivello (error, warn, info, debug)
  - Multiple transports (console, file)
  - JSON structured logs per parsing

- **dotenv**: Environment variables management
  - Configurazione separata dal codice
  - 12-Factor App compliant

### Dev Tools

- **ESLint**: Linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **tsx**: Development runtime con hot reload

---

## Architettura del Codice

### Struttura Directory

```
src/
├── bot/                    # Bot layer
│   ├── handlers/           # Request handlers
│   ├── keyboards/          # UI components (inline keyboards)
│   ├── middleware/         # Middleware functions
│   └── index.ts           # Bot initialization
│
├── services/              # Business logic layer
│   └── scheduler/         # Scheduled messages service
│
├── config/                # Configuration layer
│   ├── bot.config.ts      # Bot settings
│   └── communities.ts     # Community definitions
│
├── types/                 # Type definitions
│   └── index.ts          # Core types
│
└── utils/                 # Utilities
    ├── logger.ts         # Logging utilities
    └── helpers.ts        # Helper functions
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Handlers, Keyboards, etc.)      │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│      (Services, Scheduler)          │
├─────────────────────────────────────┤
│        Configuration Layer          │
│   (Config, Communities, Types)      │
├─────────────────────────────────────┤
│          Infrastructure             │
│  (Logger, Helpers, Middleware)      │
└─────────────────────────────────────┘
```

### Dependency Flow

```
index.ts
  ↓
bot/index.ts
  ↓
├→ handlers/ ─────→ keyboards/ ─→ config/communities.ts
├→ middleware/ ───→ utils/logger.ts
└→ services/scheduler/ ─→ config/communities.ts
```

---

## Pattern e Best Practices

### 1. Dependency Injection

```typescript
// services/scheduler/scheduler.service.ts
export class SchedulerService {
  private bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot; // Injected dependency
  }
}

// index.ts
const bot = createBot();
const scheduler = new SchedulerService(bot); // DI
```

**Perché:**
- Facilita testing (mock injection)
- Riduce coupling
- Migliora riusabilità

### 2. Single Responsibility

Ogni modulo ha una sola responsabilità:

- `commands.ts`: Solo gestione comandi
- `callbacks.ts`: Solo gestione callback
- `scheduler.service.ts`: Solo scheduling
- `logger.ts`: Solo logging

### 3. Type Safety

```typescript
// types/index.ts - Definizione centralizzata
export interface Community {
  id: string;
  name: string;
  // ...
}

// Uso type-safe
function getCommunity(id: string): Community | undefined {
  // TypeScript garantisce type safety
}
```

### 4. Error Handling

```typescript
// middleware/error.middleware.ts
export async function errorHandler(err: Error, ctx: Context) {
  logger.error('Error:', err);
  await ctx.reply('Errore imprevisto');
}

// bot/index.ts
bot.catch(errorHandler); // Global error handler
```

**Livelli di error handling:**
1. Try/catch locali per errori specifici
2. Middleware globale per errori non gestiti
3. Logging strutturato per debugging

### 5. Configuration as Code

```typescript
// config/communities.ts
export const communities: Community[] = [
  {
    id: 'wagmi-defi',
    // ... configuration
  }
];
```

**Vantaggi:**
- Version control delle configurazioni
- Type checking
- Facile testing
- No database per configurazioni statiche

### 6. Middleware Pattern

```typescript
// Logging middleware
bot.use(loggerMiddleware);

// Error middleware
bot.catch(errorHandler);

// Custom middleware (esempio futuro)
bot.use(authMiddleware);
```

**Perché:**
- Separation of concerns
- Riusabilità
- Pipeline configurabile

---

## Flussi Principali

### 1. User Command Flow

```
User: /start
  ↓
Telegram API
  ↓
Telegraf (bot/index.ts)
  ↓
loggerMiddleware (log request)
  ↓
handleStart (handlers/commands.ts)
  ↓
getMainMenuKeyboard (keyboards/main.keyboard.ts)
  ↓
ctx.reply (send to user)
  ↓
loggerMiddleware (log success)
```

### 2. Callback Query Flow

```
User: [Click button]
  ↓
Telegram API
  ↓
handleCallback (handlers/callbacks.ts)
  ↓
decodeCallbackData (utils/helpers.ts)
  ↓
Switch on action type
  ↓
├→ handleShowCommunities
├→ handleSelectCommunity
└→ handleShowLinks
  ↓
ctx.editMessageText (update message)
  ↓
ctx.answerCbQuery (acknowledge)
```

### 3. Scheduled Message Flow

```
Cron trigger (e.g., 9:00 AM)
  ↓
SchedulerService
  ↓
executeScheduledMessage
  ↓
Get message from rotation
  ↓
bot.telegram.sendMessage
  ↓
Update rotation index
  ↓
Log success/error
```

---

## Estensibilità

### Come Aggiungere Funzionalità

#### 1. Nuovo Comando

**File da modificare:**
- `src/bot/handlers/commands.ts` (handler)
- `src/bot/index.ts` (registration)

**Esempio:**

```typescript
// handlers/commands.ts
export async function handleStats(ctx: Context) {
  await ctx.reply('Statistics coming soon!');
}

// bot/index.ts
bot.command('stats', handleStats);
```

#### 2. Nuovo Servizio

**Struttura:**

```
src/services/analytics/
├── analytics.service.ts
├── analytics.types.ts
└── index.ts
```

**Esempio:**

```typescript
// services/analytics/analytics.service.ts
export class AnalyticsService {
  constructor(private bot: Telegraf) {}

  trackEvent(event: string) {
    logger.info('Event tracked', { event });
  }
}

// index.ts
const analytics = new AnalyticsService(bot);
```

#### 3. Nuova Community

**File da modificare:**
- `src/config/communities.ts`

**Esempio:**

```typescript
{
  id: 'wagmi-trading',
  name: 'Wagmi Trading',
  chatId: 'YOUR_CHAT_ID',
  description: 'Trading signals community',
  emoji: '📈',
  links: {
    telegram: 'https://t.me/wagmi_trading',
  },
  scheduledMessages: [],
  enabled: true,
}
```

#### 4. Database Integration (Futuro)

**Architettura proposta:**

```
src/database/
├── models/
│   ├── user.model.ts
│   └── message.model.ts
├── repositories/
│   ├── user.repository.ts
│   └── message.repository.ts
└── index.ts
```

**Pattern:**
- Repository pattern per data access
- Models per definizioni
- Migrations per schema changes

#### 5. Webhook Mode (Alternative a Long Polling)

**File da creare:**
- `src/bot/webhook.ts`

**Esempio:**

```typescript
import express from 'express';

export function setupWebhook(bot: Telegraf, port: number) {
  const app = express();
  app.use(bot.webhookCallback('/webhook'));
  app.listen(port);
}
```

---

## Design Decisions

### Perché Telegraf?

**Pro:**
- API wrapper elegante
- Middleware support
- Active community
- TypeScript support nativo

**Alternative considerate:**
- `node-telegram-bot-api`: Più low-level
- `grammY`: Simile, meno maturo

### Perché node-cron?

**Pro:**
- Syntax standard (Unix cron)
- Lightweight
- No external dependencies
- Timezone support

**Alternative considerate:**
- `agenda`: Richiede MongoDB
- `bull`: Richiede Redis
- `later`: Syntax più complessa

### Perché Winston?

**Pro:**
- Structured logging
- Multiple transports
- Log levels
- Production-ready

**Alternative considerate:**
- `pino`: Più performante, meno features
- `bunyan`: Meno mantenuto

### Perché No Database (per ora)?

**Rationale:**
- Community configs sono statiche
- No user-generated data (per ora)
- Simplicità deployment
- Cost-effective

**Quando aggiungere DB:**
- User preferences
- Analytics
- Dynamic community management
- Message history

---

## Performance Considerations

### Current Architecture

- **Stateless**: No shared state tra requests
- **Single instance**: Sufficiente per community medie
- **Memory usage**: ~50-100MB
- **CPU usage**: Minimal (event-driven)

### Scaling Strategy (Futuro)

**Vertical Scaling:**
- Aumentare RAM/CPU su Digital Ocean
- Sufficiente fino a ~100k users

**Horizontal Scaling:**
- Multiple bot instances
- Redis per shared state
- Load balancer per webhook

**Optimization:**
- Caching delle community configs
- Message queue per batch sending
- Database connection pooling

---

## Security

### Current Measures

1. **Environment Variables**: Token non in codebase
2. **Input Validation**: Callback data validation
3. **Error Handling**: No sensitive info in error messages
4. **Logging**: Structured, no PII

### Future Enhancements

- Rate limiting per user
- Admin authentication per comandi speciali
- Encryption per sensitive data
- Audit logging

---

## Testing Strategy

### Current

- Manual testing
- Type checking (TypeScript)

### Recommended

```typescript
// tests/handlers/commands.test.ts
describe('handleStart', () => {
  it('should send welcome message', async () => {
    const ctx = mockContext();
    await handleStart(ctx);
    expect(ctx.reply).toHaveBeenCalled();
  });
});
```

**Test Pyramid:**
- Unit tests: Services, utils
- Integration tests: Handlers con mock Telegraf
- E2E tests: Full flow con test bot

---

## Conclusione

L'architettura del Wagmi-Lab Bot è progettata per essere:

✅ **Maintainable**: Codice pulito e organizzato
✅ **Scalable**: Facile aggiungere features
✅ **Testable**: Componenti isolati
✅ **Type-Safe**: TypeScript strict
✅ **Production-Ready**: Error handling, logging, deployment

**Prossimi passi architetturali:**
1. Implementare testing suite
2. Aggiungere database per analytics
3. Webhook mode per performance
4. Admin panel per gestione community

---

**Keep it simple, keep it scalable!** 🏗️
