/**
 * PM2 Ecosystem Configuration
 *
 * Production process manager configuration for running the bot with PM2
 *
 * Usage:
 * - Start: pm2 start ecosystem.config.js
 * - Stop: pm2 stop wagmi-lab-bot
 * - Restart: pm2 restart wagmi-lab-bot
 * - Logs: pm2 logs wagmi-lab-bot
 * - Monitor: pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'wagmi-lab-bot',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',

      // Auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',

      // Environment
      env: {
        NODE_ENV: 'production',
        TZ: 'Europe/Rome',
      },

      // Logging
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Restart strategy
      exp_backoff_restart_delay: 100,
      max_restarts: 10,
      min_uptime: '10s',

      // Advanced
      kill_timeout: 5000,
      listen_timeout: 3000,
      shutdown_with_message: true,
    },
  ],
};
