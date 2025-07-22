"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong and latency info!"),
    async execute(interaction) {
        await interaction.reply({ content: "Pinging..." });
        const sent = await interaction.fetchReply();
        const ping = interaction.client.ws.ping;
        const apiLatency = sent.createdTimestamp - interaction.createdTimestamp;
        await interaction.editReply(`🏓 Pong!\nLatency: **${apiLatency}ms**\nWS Ping: **${ping}ms**`);
    },
};
