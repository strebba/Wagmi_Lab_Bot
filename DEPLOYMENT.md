# Deployment Guide - Digital Ocean

This guide will walk you through deploying the Wagmi Lab Bot on a Digital Ocean Droplet.

## Prerequisites

- A Digital Ocean account
- Domain name (optional, for SSL/HTTPS)
- Bot token from @BotFather
- Community chat IDs

## Step 1: Create a Digital Ocean Droplet

1. Log in to [Digital Ocean](https://cloud.digitalocean.com)
2. Create a new Droplet:
   - **Distribution**: Ubuntu 22.04 LTS (recommended)
   - **Plan**: Basic ($6/month - 1GB RAM, 1 vCPU should be sufficient)
   - **Datacenter**: Choose closest to Europe (Frankfurt or Amsterdam recommended for Europe/Rome timezone)
   - **Authentication**: SSH keys (recommended) or password
   - **Hostname**: wagmi-lab-bot (or your preference)

3. Wait for the droplet to be created and note the IP address

## Step 2: Connect to Your Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

## Step 3: Install Dependencies

### Update System
```bash
apt update && apt upgrade -y
```

### Install Node.js (v20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

### Verify Installation
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Install Git
```bash
apt install -y git
```

### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

## Step 4: Clone and Setup the Project

### Clone Repository
```bash
cd /opt
git clone git@github.com:strebba/Wagmi_Lab_Bot.git
cd Wagmi_Lab_Bot
```

If using HTTPS instead:
```bash
git clone https://github.com/strebba/Wagmi_Lab_Bot.git
```

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
nano .env
```

Update the `.env` file with your production values:
```env
# Telegram Bot Configuration
BOT_TOKEN=your_actual_bot_token

# Environment
NODE_ENV=production

# Logging
LOG_LEVEL=info

# Database (optional)
DATABASE_URL=./data/bot.db

# Timezone
TZ=Europe/Rome

# Bot Settings
BOT_NAME=Wagmi Lab Bot
BOT_USERNAME=Wagmi_Lab_bot
```

Save and exit (Ctrl+X, then Y, then Enter)

### Build the Project
```bash
npm run build
```

## Step 5: Configure Communities

Edit the community configuration:
```bash
nano src/config/communities.ts
```

Make sure to:
- Add the correct `chatId` for the Trading Club community
- Verify all links and settings are correct
- Enable/disable scheduled messages as needed

After editing, rebuild:
```bash
npm run build
```

## Step 6: Start the Bot with PM2

### Start the bot
```bash
pm2 start dist/index.js --name wagmi-lab-bot
```

### Check status
```bash
pm2 status
```

### View logs
```bash
pm2 logs wagmi-lab-bot
```

### Configure PM2 to start on system reboot
```bash
pm2 startup
pm2 save
```

## Step 7: PM2 Commands Reference

```bash
# View status
pm2 status

# View logs (live)
pm2 logs wagmi-lab-bot

# View logs (last 100 lines)
pm2 logs wagmi-lab-bot --lines 100

# Restart bot
pm2 restart wagmi-lab-bot

# Stop bot
pm2 stop wagmi-lab-bot

# Start bot
pm2 start wagmi-lab-bot

# Delete from PM2
pm2 delete wagmi-lab-bot

# Monitor resources
pm2 monit
```

## Step 8: Updating the Bot

When you need to update the bot with new changes:

```bash
cd /opt/Wagmi_Lab_Bot
git pull origin main
npm install
npm run build
pm2 restart wagmi-lab-bot
```

## Step 9: Setting Up Firewall (Optional but Recommended)

```bash
# Enable UFW
ufw allow OpenSSH
ufw enable

# The bot doesn't need any incoming ports open
# It only makes outgoing connections to Telegram
```

## Step 10: Monitoring and Logs

### View application logs
```bash
# PM2 logs
pm2 logs wagmi-lab-bot

# Application logs (if using file logging)
tail -f /opt/Wagmi_Lab_Bot/logs/combined.log
tail -f /opt/Wagmi_Lab_Bot/logs/error.log
```

### Monitor system resources
```bash
# PM2 monitoring
pm2 monit

# System resources
htop  # Install with: apt install htop
```

## Troubleshooting

### Bot not starting
1. Check PM2 logs: `pm2 logs wagmi-lab-bot --lines 50`
2. Verify .env file is configured correctly: `cat /opt/Wagmi_Lab_Bot/.env`
3. Check if build succeeded: `ls -la /opt/Wagmi_Lab_Bot/dist`
4. Verify Node.js version: `node --version` (should be v20+)

### Bot crashes or restarts
1. Check error logs: `pm2 logs wagmi-lab-bot --err --lines 100`
2. Check application logs: `tail -100 /opt/Wagmi_Lab_Bot/logs/error.log`
3. Verify bot token is valid
4. Check chat IDs are correct

### Scheduled messages not sending
1. Verify timezone is correct in .env: `echo $TZ`
2. Check scheduler logs in PM2
3. Verify cron expressions are valid
4. Check if scheduled messages are enabled in communities config

### Memory issues
1. Check memory usage: `pm2 monit`
2. Consider upgrading droplet plan if needed
3. Enable log rotation to prevent log files from growing too large

## Security Best Practices

1. **Never commit .env to Git**
   - It's already in .gitignore, but double-check
   
2. **Use SSH keys instead of passwords**
   - More secure for server access
   
3. **Keep system updated**
   ```bash
   apt update && apt upgrade -y
   ```

4. **Use non-root user** (Advanced)
   ```bash
   adduser wagmibot
   usermod -aG sudo wagmibot
   # Copy files to user directory
   # Run PM2 as this user
   ```

5. **Enable automatic security updates**
   ```bash
   apt install unattended-upgrades
   dpkg-reconfigure -plow unattended-upgrades
   ```

## Backup Strategy

### Backup community configuration
```bash
# Create backup directory
mkdir -p /opt/backups

# Backup config files
cp /opt/Wagmi_Lab_Bot/src/config/communities.ts /opt/backups/communities-$(date +%Y%m%d).ts
cp /opt/Wagmi_Lab_Bot/.env /opt/backups/.env-$(date +%Y%m%d)
```

### Automated daily backups (Optional)
```bash
# Create backup script
cat > /opt/backup-bot.sh << 'SCRIPT'
#!/bin/bash
mkdir -p /opt/backups
cp /opt/Wagmi_Lab_Bot/src/config/communities.ts /opt/backups/communities-$(date +%Y%m%d).ts
cp /opt/Wagmi_Lab_Bot/.env /opt/backups/.env-$(date +%Y%m%d)
# Keep only last 7 days of backups
find /opt/backups -name "*.ts" -mtime +7 -delete
find /opt/backups -name ".env-*" -mtime +7 -delete
SCRIPT

chmod +x /opt/backup-bot.sh

# Add to crontab (daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backup-bot.sh") | crontab -
```

## Docker Alternative (Optional)

If you prefer using Docker, the project includes Docker support:

```bash
cd /opt/Wagmi_Lab_Bot

# Build image
docker build -t wagmi-lab-bot .

# Run container
docker run -d \
  --name wagmi-lab-bot \
  --env-file .env \
  --restart unless-stopped \
  wagmi-lab-bot

# View logs
docker logs -f wagmi-lab-bot

# Stop container
docker stop wagmi-lab-bot

# Start container
docker start wagmi-lab-bot
```

## Performance Optimization

### For production environments:
1. **Enable log rotation** to prevent disk space issues
2. **Monitor memory usage** with PM2
3. **Use production logging level** (info or warn, not debug)
4. **Consider using a database** for storing message rotation state (future enhancement)

## Support

If you encounter issues:
1. Check the logs first
2. Verify all environment variables are set correctly
3. Test bot token with Telegram API
4. Review community configuration

---

**Deployment completed!** Your Wagmi Lab Bot should now be running on Digital Ocean and sending scheduled messages to your communities.
