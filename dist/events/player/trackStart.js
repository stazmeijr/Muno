"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes >= 60) {
        const hours = Math.floor(minutes / 60);
        const remMinutes = minutes % 60;
        return `${hours}h ${remMinutes}m`;
    }
    return `${minutes}m ${seconds > 0 ? `${seconds}s` : ""}`.trim();
}
exports.default = {
    name: "trackStart",
    once: false,
    async execute(client, player, track) {
        try {
            const channel = client.channels.cache.get(player.textChannel);
            if (!channel) {
                console.error("Channel not found:", player.textChannel);
                return;
            }
            // Safe thumbnail handling
            let thumbnail = track.info.thumbnail ??
                track.info.artworkUrl ??
                (track.info.identifier
                    ? `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`
                    : null);
            // Validate thumbnail URL
            if (thumbnail && !thumbnail.startsWith('http')) {
                thumbnail = null;
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setColor("#1DB954")
                .setAuthor({
                name: `Now Playing`,
                iconURL: "https://media.tenor.com/Sb0yPHMgNaUAAAAi/music-disc.gif",
            })
                .setDescription(`## **[${track.info.title || "Unknown Title"}](${track.info.uri || "#"})**`)
                .addFields({
                name: "<:author:1327309078585671823> Author",
                value: track.info.author || "Unknown",
                inline: true
            }, {
                name: "<a:Duration:1244383251355926591> Duration",
                value: track.info.isStream ? "🔴 Livestream" : formatDuration(track.info.length || 0),
                inline: true,
            }, {
                name: "<:J_req:1249769826252230727> Requester",
                value: track.info.requester?.id ? `<@${track.info.requester.id}>` : "Unknown",
                inline: true,
            });
            // Only set image if thumbnail is valid
            if (thumbnail) {
                embed.setImage(thumbnail);
            }
            const row = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId("pause_resume")
                .setEmoji("⏯️")
                .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
                .setCustomId("skip")
                .setEmoji("⏭️")
                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                .setCustomId("stop")
                .setEmoji("⏹️")
                .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
                .setCustomId("volume_down")
                .setEmoji("🔉")
                .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
                .setCustomId("volume_up")
                .setEmoji("🔊")
                .setStyle(discord_js_1.ButtonStyle.Secondary));
            const message = await channel.send({
                embeds: [embed],
                components: [row],
            });
            player.nowPlayingMessage = message;
            const collector = message.createMessageComponentCollector({
                time: 300000 // 5 minutes timeout
            });
            collector.on("collect", async (interaction) => {
                try {
                    if (!interaction.isButton())
                        return;
                    const currentPlayer = client.riffy?.players.get(interaction.guildId);
                    if (!currentPlayer) {
                        return interaction.reply({
                            content: "❌ No player found.",
                            ephemeral: true
                        });
                    }
                    const memberVC = interaction.member?.voice?.channelId;
                    if (memberVC !== currentPlayer.voiceChannel) {
                        return interaction.reply({
                            content: "❌ You must be in the same voice channel as the bot.",
                            ephemeral: true,
                        });
                    }
                    switch (interaction.customId) {
                        case "pause_resume":
                            if (currentPlayer.paused) {
                                currentPlayer.pause(false);
                                await interaction.reply({ content: "▶️ Resumed!", ephemeral: true });
                            }
                            else {
                                currentPlayer.pause(true);
                                await interaction.reply({ content: "⏸️ Paused!", ephemeral: true });
                            }
                            break;
                        case "skip":
                            currentPlayer.stop();
                            await interaction.reply({ content: "⏭️ Skipped!", ephemeral: true });
                            break;
                        case "stop":
                            currentPlayer.stop();
                            await interaction.reply({ content: "⏹️ Stopped!", ephemeral: true });
                            try {
                                await player.nowPlayingMessage?.delete();
                            }
                            catch (err) {
                                console.error("Error deleting message:", err);
                            }
                            player.nowPlayingMessage = null;
                            collector.stop();
                            break;
                        case "volume_down":
                            const volDown = Math.max(0, currentPlayer.volume - 10);
                            currentPlayer.setVolume(volDown);
                            await interaction.reply({ content: `🔉 Volume: ${volDown}%`, ephemeral: true });
                            break;
                        case "volume_up":
                            const volUp = Math.min(100, currentPlayer.volume + 10);
                            currentPlayer.setVolume(volUp);
                            await interaction.reply({ content: `🔊 Volume: ${volUp}%`, ephemeral: true });
                            break;
                    }
                }
                catch (error) {
                    console.error("Error handling interaction:", error);
                    try {
                        await interaction.reply({
                            content: "❌ An error occurred while processing your request.",
                            ephemeral: true
                        });
                    }
                    catch { }
                }
            });
            collector.on("end", () => {
                // Disable buttons when collector ends
                const disabledRow = new discord_js_1.ActionRowBuilder().addComponents(row.components.map(button => discord_js_1.ButtonBuilder.from(button).setDisabled(true)));
                message.edit({ components: [disabledRow] }).catch(() => { });
            });
        }
        catch (error) {
            console.error("Error in trackStart event:", error);
        }
    },
};
