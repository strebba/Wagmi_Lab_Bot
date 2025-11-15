# Guida al Deployment - Wagmi-Lab Bot

Questa guida dettagliata spiega come deployare il bot Telegram su Digital Ocean.

## Indice

1. [Preparazione](#preparazione)
2. [Deploy su App Platform](#deploy-su-app-platform)
3. [Deploy su Droplet](#deploy-su-droplet)
4. [Configurazione Post-Deploy](#configurazione-post-deploy)
5. [Monitoraggio e Manutenzione](#monitoraggio-e-manutenzione)

---

## Preparazione

### 1. Ottenere un Bot Token

1. Apri Telegram e cerca [@BotFather](https://t.me/BotFather)
2. Invia `/newbot`
3. Segui le istruzioni per creare il bot
4. Salva il token che riceverai (formato: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Configurare le Community

1. Aggiungi il bot alle tue community Telegram
2. Rendilo admin (necessario per inviare messaggi)
3. Ottieni i Chat ID:

```bash
# Invia un messaggio nella community, poi:
curl https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
```

4. Aggiorna `src/config/communities.ts` con i Chat ID ottenuti

### 3. Testare in Locale

Prima di deployare, testa il bot in locale:

```bash
# Crea il file .env
cp .env.example .env

# Aggiungi il tuo token
echo "BOT_TOKEN=your_token_here" >> .env

# Avvia in development
npm run dev
```

Verifica che:
- Il bot risponda ai comandi
- I bottoni funzionino
- I messaggi ricorrenti siano configurati (non verranno inviati subito, ma controlla i log)

---

## Deploy su App Platform

### Metodo Consigliato - Più Semplice

#### Step 1: Preparare il Repository

1. Crea un repository GitHub (privato consigliato)
2. Push del codice:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/wagmi-lab-bot.git
git push -u origin main
```

#### Step 2: Creare l'App su Digital Ocean

1. Vai su [Digital Ocean App Platform](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Seleziona **"GitHub"** come source
4. Autorizza Digital Ocean ad accedere al repository
5. Seleziona il repository `wagmi-lab-bot`
6. Seleziona il branch `main`

#### Step 3: Configurare l'App

**App Info:**
- Nome: `wagmi-lab-bot`
- Region: Scegli la più vicina (es: Frankfurt)

**Resources:**
- Type: **Worker** (non Web Service, perché è un bot non un server web)
- Build Command: `npm run build`
- Run Command: `node dist/index.js`

**Environment Variables:**

Click su **"Edit"** e aggiungi:

```
BOT_TOKEN=your_bot_token_here
NODE_ENV=production
LOG_LEVEL=info
TZ=Europe/Rome
BOT_NAME=Wagmi Lab Bot
BOT_USERNAME=wagmi_lab_bot
```

**Plan:**
- Basic: $5/month (sufficiente per bot di community)
- Professional: Se hai molte community o traffico alto

#### Step 4: Deploy

1. Click **"Create Resources"**
2. Attendi il build e deploy (3-5 minuti)
3. Controlla i logs per verificare che il bot sia attivo

#### Step 5: Deploy Automatici

Ora ogni push su `main` triggera un auto-deploy:

```bash
# Fai modifiche al codice
git add .
git commit -m "Update communities config"
git push

# Digital Ocean farà automaticamente il redeploy
```

---

## Deploy su Droplet

### Metodo Avanzato - Più Controllo

#### Step 1: Creare un Droplet

1. Vai su [Digital Ocean Droplets](https://cloud.digitalocean.com/droplets)
2. Click **"Create Droplet"**
3. Scegli:
   - **OS**: Ubuntu 22.04 LTS
   - **Plan**: Basic $6/month (1GB RAM, sufficiente)
   - **Region**: Scegli la più vicina
   - **Authentication**: SSH Key (consigliato) o Password
4. Click **"Create Droplet"**

#### Step 2: Setup Iniziale del Server

```bash
# SSH nel Droplet
ssh root@your_droplet_ip

# Update del sistema
apt update && apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Installa Docker Compose
apt install docker-compose -y

# Crea directory per il bot
mkdir -p /opt/wagmi-lab-bot
```

#### Step 3: Trasferire i File

**Opzione A: Da locale al server**

```bash
# Dal tuo computer locale
scp -r ./* root@your_droplet_ip:/opt/wagmi-lab-bot/
```

**Opzione B: Clone da Git**

```bash
# Sul Droplet
cd /opt/wagmi-lab-bot
git clone https://github.com/your-username/wagmi-lab-bot.git .
```

#### Step 4: Configurare l'Environment

```bash
# Sul Droplet
cd /opt/wagmi-lab-bot

# Crea il file .env
cat > .env << EOF
BOT_TOKEN=your_bot_token_here
NODE_ENV=production
LOG_LEVEL=info
TZ=Europe/Rome
BOT_NAME=Wagmi Lab Bot
BOT_USERNAME=wagmi_lab_bot
EOF
```

#### Step 5: Build e Avvio

```bash
# Build dell'immagine Docker
docker-compose build

# Avvio del bot
docker-compose up -d

# Verifica che sia running
docker-compose ps

# Controlla i logs
docker-compose logs -f wagmi-bot
```

#### Step 6: Configurare Auto-Start

```bash
# Assicurati che Docker parta al boot
systemctl enable docker

# Il container è già configurato con restart: unless-stopped
```

---

## Configurazione Post-Deploy

### Verificare il Funzionamento

1. **Testa i comandi:**
   - Apri Telegram e cerca il tuo bot
   - Invia `/start`
   - Prova i bottoni inline
   - Verifica la navigazione

2. **Controlla i logs:**

**App Platform:**
```
Runtime Logs → Select your app → View logs
```

**Droplet:**
```bash
docker-compose logs -f wagmi-bot
```

3. **Verifica i messaggi ricorrenti:**
   - Attendi l'orario programmato
   - Oppure modifica temporaneamente il cron per testare

### Setup Alerting

**Digital Ocean Monitoring:**

1. Vai su Droplet/App → Monitoring
2. Abilita alerts per:
   - CPU > 80%
   - Memory > 80%
   - Disk > 80%

### Backup

**Per Droplet:**

1. Enable Droplet Backups ($1.20/month)
2. O crea snapshot manuali regolari

**Per App Platform:**

Il codice è su Git, quindi già backuppato.

---

## Monitoraggio e Manutenzione

### Controllare i Logs

**App Platform:**
```
Dashboard → Apps → Select app → Runtime Logs
```

**Droplet:**
```bash
# Logs real-time
docker-compose logs -f

# Ultimi 100 log
docker-compose logs --tail=100

# Logs di un giorno specifico
docker-compose logs --since 2024-01-15
```

### Aggiornare il Bot

**App Platform:**
```bash
# Locale
git add .
git commit -m "Update"
git push
# Auto-deploy automatico
```

**Droplet:**
```bash
# SSH nel Droplet
ssh root@your_droplet_ip
cd /opt/wagmi-lab-bot

# Pull delle modifiche
git pull

# Rebuild e restart
docker-compose down
docker-compose build
docker-compose up -d
```

### Comandi Utili

```bash
# Restart del bot
docker-compose restart

# Stop del bot
docker-compose down

# Start del bot
docker-compose up -d

# Rebuild completo
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Pulire containers vecchi
docker system prune -a
```

### Monitorare Risorse

```bash
# Stats in real-time
docker stats

# Spazio disco
df -h

# Memory usage
free -m
```

### Scalare (se necessario)

**App Platform:**
- Dashboard → App → Settings → Scaling
- Aumenta RAM/CPU se necessario

**Droplet:**
- Resize Droplet da dashboard Digital Ocean
- No downtime se usi resize con disco

---

## Troubleshooting

### Bot non risponde

```bash
# Controlla se il container è running
docker-compose ps

# Verifica i logs
docker-compose logs --tail=50 wagmi-bot

# Restart
docker-compose restart
```

### Messaggi ricorrenti non vengono inviati

1. Verifica il timezone: `echo $TZ`
2. Controlla che il bot sia admin nella community
3. Verifica il Chat ID in `communities.ts`
4. Controlla i logs per errori

### Out of Memory

```bash
# Controlla memory usage
docker stats

# Se necessario, aumenta swap (Droplet):
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### Errori di build

```bash
# Clean build
docker-compose down -v
docker system prune -a
docker-compose build --no-cache
```

---

## Costi Stimati

### App Platform
- **Basic**: $5/mese
- **Professional**: $12/mese (se serve più potenza)

### Droplet
- **Basic**: $6/mese (1GB RAM)
- **Backup**: +$1.20/mese (opzionale)
- **Total**: ~$7/mese

**Raccomandazione**: Inizia con App Platform ($5/mese) per semplicità. Se hai esigenze particolari, passa a Droplet.

---

## Sicurezza

### Best Practices

1. **Non condividere il BOT_TOKEN**
2. **Usa SSH Keys invece di password** (Droplet)
3. **Abilita firewall:**

```bash
# Solo per Droplet
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

4. **Aggiorna regolarmente:**

```bash
# Droplet
apt update && apt upgrade -y
```

5. **Monitora i logs** per attività sospette

---

## Conclusione

Il bot è ora deployato e operativo!

**Prossimi passi:**
- Monitora i logs regolarmente
- Aggiungi nuove community quando necessario
- Estendi le funzionalità basandoti sull'architettura modulare

**Supporto:**
- Docs: [Digital Ocean Docs](https://docs.digitalocean.com/)
- Community: [Digital Ocean Community](https://www.digitalocean.com/community)

---

**Happy deploying!** 🚀
