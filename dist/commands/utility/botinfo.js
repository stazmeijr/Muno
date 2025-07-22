"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Displays bot information"),
    async execute(interaction) {
        const client = interaction.client;
        await interaction.deferReply();
        // Uptime formatting
        const uptime = client.uptime ?? 0;
        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;
        const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        // Resource usage
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalMemory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);
        const cpuUsage = process.cpuUsage();
        const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);
        // Basic stats
        const servers = client.guilds.cache.size;
        const users = client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        const channels = client.channels.cache.size;
        const createdAt = client.user?.createdAt;
        const ping = client.ws.ping;
        const nodeVersion = process.version;
        // Lavalink info (Riffy)
        let lavalinkStatus = "Disconnected";
        let lavalinkUptime = "0s";
        let lavalinkMemory = "0.00";
        let connectedPlayers = 0;
        try {
            const riffy = client.riffy;
            if (riffy?.nodes) {
                riffy.nodes.forEach((node) => {
                    const stats = node.stats;
                    if (node.connected && stats) {
                        lavalinkStatus = "Connected";
                        connectedPlayers += stats.playingPlayers ?? 0;
                        lavalinkMemory = (stats.memory?.used / 1024 / 1024).toFixed(2);
                        const up = stats.uptime;
                        const d = Math.floor(up / 86400000);
                        const h = Math.floor(up / 3600000) % 24;
                        const m = Math.floor(up / 60000) % 60;
                        const s = Math.floor(up / 1000) % 60;
                        lavalinkUptime = `${d}d ${h}h ${m}m ${s}s`;
                    }
                });
            }
        }
        catch (err) {
            lavalinkStatus = "Error";
        }
        let dbStatus = "Unknown";
        let dbPing = "N/A";
        try {
            const mongoose = client.mongoose;
            if (mongoose?.connection) {
                const state = mongoose.connection.readyState;
                dbStatus = ["Disconnected", "Connected", "Connecting", "Disconnecting"][state] ?? "Unknown";
                if (state === 1) {
                    const start = Date.now();
                    await mongoose.connection.db.admin().ping();
                    dbPing = `${Date.now() - start}ms`;
                }
            }
        }
        catch {
            dbStatus = "Error";
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(`${client.user?.username} • Bot Information`)
            .setThumbnail(client.user?.displayAvatarURL() ?? "")
            .setDescription(`> Bot ID: \`${client.user?.id}\`\n> Created: <t:${Math.floor(createdAt.getTime() / 1000)}:R>\n> Developer: **Staz**`)
            .addFields({
            name: "Bot Stats",
            value: `\`\`\`yaml\nServers: ${servers}\nUsers: ${users}\nChannels: ${channels}\nUptime: ${uptimeString}\n\`\`\``,
        }, {
            name: "Performance",
            value: `\`\`\`yaml\nMemory: ${memoryUsage} MB\nTotal Memory: ${totalMemory} MB\nCPU: ${cpuPercent}%\nPing: ${ping}ms\n\`\`\``,
        }, {
            name: "Lavalink",
            value: `\`\`\`yaml\nStatus: ${lavalinkStatus}\nUptime: ${lavalinkUptime}\nMemory: ${lavalinkMemory} MB\nPlayers: ${connectedPlayers}\n\`\`\``,
        }, {
            name: "Database",
            value: `\`\`\`yaml\nStatus: ${dbStatus}\nPing: ${dbPing}\n\`\`\``,
        }, {
            name: "System",
            value: `\`\`\`yaml\nPlatform: ${process.platform}\nArch: ${process.arch}\nNode.js: ${nodeVersion}\nDiscord.js: v${discord_js_2.version}\n\`\`\``,
        })
            .setFooter({
            text: `Requested by ${interaction.user.displayName}`,
            iconURL: interaction.user.displayAvatarURL(),
        })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    }
};
