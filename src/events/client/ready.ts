import {
  Client,
  Events,
  ActivityType,
} from "discord.js";
import { logger } from "../../utils/logger";
import { config } from "../../config";

export default {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    logger.success(`Bot is online as ${client.user?.tag}`);

    const activities = config.presence.activities;

    client.user?.setPresence({
  status: config.presence.status,
  activities,
});
  },
};