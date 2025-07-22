"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song or playlist")
        .addStringOption((option) => option
        .setName("query")
        .setDescription("Song name or URL")
        .setRequired(true)),
    async execute(interaction) {
        const client = interaction.client;
        const query = interaction.options.getString("query", true);
        const voiceChannel = interaction.member?.voice?.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: "❌ You must be in a voice channel to use this command!",
                ephemeral: true,
            });
        }
        try {
            await interaction.deferReply();
            const player = client.riffy.createConnection({
                guildId: interaction.guildId,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channelId,
                deaf: true,
            });
            const result = await client.riffy.resolve({
                query,
                requester: interaction.user,
            });
            const { loadType, tracks, playlistInfo } = result;
            if (!loadType || !tracks?.length) {
                return interaction.editReply("❌ No results found.");
            }
            if (loadType === "playlist") {
                for (const track of tracks) {
                    track.info.requester = interaction.user;
                    player.queue.add(track);
                }
                const playlistEmbed = new discord_js_1.EmbedBuilder()
                    .setColor("#1DB954")
                    .setDescription(`➕ Added **${tracks.length}** tracks from playlist: **[${playlistInfo.name}](${tracks[0].info.uri})**`);
                await interaction.editReply({ embeds: [playlistEmbed] });
                if (!player.playing && !player.paused)
                    await player.play();
            }
            else {
                const track = tracks[0];
                track.info.requester = interaction.user;
                player.queue.add(track);
                const trackEmbed = new discord_js_1.EmbedBuilder()
                    .setColor("#1DB954")
                    .setDescription(`➕ Added **[${track.info.title}](${track.info.uri})** to the queue`);
                await interaction.editReply({ embeds: [trackEmbed] });
                if (!player.playing && !player.paused)
                    await player.play();
            }
        }
        catch (err) {
            console.error("Error in /play:", err);
            return interaction.editReply({
                content: `❌ Error: ${err.message || "Something went wrong."}`,
            });
        }
    },
};
