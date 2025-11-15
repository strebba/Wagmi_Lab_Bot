import * as cron from 'node-cron';
import { Telegraf } from 'telegraf';
import { logger } from '../../utils/logger';
import { getEnabledCommunities } from '../../config/communities';
import { ScheduledMessage, Community } from '../../types';

/**
 * Scheduler service for managing recurring messages
 */
export class SchedulerService {
  private tasks: Map<string, cron.ScheduledTask> = new Map();
  private bot: Telegraf;

  constructor(bot: Telegraf) {
    this.bot = bot;
  }

  /**
   * Initialize all scheduled messages
   */
  public initialize(): void {
    logger.info('Initializing scheduler service...');

    const enabledCommunities = getEnabledCommunities();

    enabledCommunities.forEach((community) => {
      community.scheduledMessages.forEach((scheduledMessage) => {
        if (scheduledMessage.enabled) {
          this.scheduleMessage(community, scheduledMessage);
        }
      });
    });

    logger.info('Scheduler service initialized', {
      totalTasks: this.tasks.size,
      communities: enabledCommunities.length,
    });
  }

  /**
   * Schedule a single message
   */
  private scheduleMessage(community: Community, scheduledMessage: ScheduledMessage): void {
    try {
      const taskId = `${community.id}-${scheduledMessage.id}`;

      // Validate cron expression
      if (!cron.validate(scheduledMessage.cronExpression)) {
        logger.error('Invalid cron expression', {
          taskId,
          cronExpression: scheduledMessage.cronExpression,
        });
        return;
      }

      // Create scheduled task
      const task = cron.schedule(
        scheduledMessage.cronExpression,
        async () => {
          await this.executeScheduledMessage(community, scheduledMessage);
        },
        {
          timezone: process.env.TZ || 'Europe/Rome',
        }
      );

      this.tasks.set(taskId, task);

      logger.info('Scheduled message created', {
        taskId,
        community: community.name,
        cronExpression: scheduledMessage.cronExpression,
        messagesCount: scheduledMessage.messages.length,
      });
    } catch (error) {
      logger.error('Failed to schedule message', {
        communityId: community.id,
        messageId: scheduledMessage.id,
        error,
      });
    }
  }

  /**
   * Execute a scheduled message
   */
  private async executeScheduledMessage(
    community: Community,
    scheduledMessage: ScheduledMessage
  ): Promise<void> {
    try {
      if (!community.chatId) {
        logger.warn('Community has no chatId configured, skipping message', {
          communityId: community.id,
        });
        return;
      }

      // Get the next message to send (rotate through messages)
      const messageIndex = scheduledMessage.currentIndex % scheduledMessage.messages.length;
      const messageText = scheduledMessage.messages[messageIndex];

      // Send message to community (with topic support)
      const sendOptions: any = {
        parse_mode: 'Markdown',
        link_preview_options: { is_disabled: false },
      };

      // Add message_thread_id if this is a forum topic
      if (community.messageThreadId) {
        sendOptions.message_thread_id = community.messageThreadId;
      }

      await this.bot.telegram.sendMessage(community.chatId, messageText, sendOptions);

      // Update current index for next rotation
      scheduledMessage.currentIndex =
        (scheduledMessage.currentIndex + 1) % scheduledMessage.messages.length;
      scheduledMessage.lastSent = new Date();

      logger.info('Scheduled message sent successfully', {
        communityId: community.id,
        messageId: scheduledMessage.id,
        messageIndex,
        nextIndex: scheduledMessage.currentIndex,
      });
    } catch (error) {
      logger.error('Failed to send scheduled message', {
        communityId: community.id,
        messageId: scheduledMessage.id,
        error,
      });
    }
  }

  /**
   * Stop a specific scheduled task
   */
  public stopTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.stop();
      this.tasks.delete(taskId);
      logger.info('Scheduled task stopped', { taskId });
    }
  }

  /**
   * Stop all scheduled tasks
   */
  public stopAll(): void {
    logger.info('Stopping all scheduled tasks...');

    this.tasks.forEach((task, taskId) => {
      task.stop();
      logger.info('Task stopped', { taskId });
    });

    this.tasks.clear();
    logger.info('All scheduled tasks stopped');
  }

  /**
   * Get status of all scheduled tasks
   */
  public getStatus(): {
    totalTasks: number;
    tasks: Array<{ taskId: string; isRunning: boolean }>;
  } {
    const tasks = Array.from(this.tasks.entries()).map(([taskId, task]) => ({
      taskId,
      isRunning: task !== null,
    }));

    return {
      totalTasks: this.tasks.size,
      tasks,
    };
  }

  /**
   * Reload scheduler (useful for updating configurations)
   */
  public reload(): void {
    logger.info('Reloading scheduler...');
    this.stopAll();
    this.initialize();
  }
}
