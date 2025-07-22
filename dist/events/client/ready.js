"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("../../utils/logger");
const config_1 = require("../../config");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client) {
        logger_1.logger.success(`Bot is online as ${client.user?.tag}`);
        const activities = config_1.config.presence.activities;
        client.user?.setPresence({
            status: config_1.config.presence.status,
            activities,
        });
    },
};
