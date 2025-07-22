import {
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

function formatDuration(ms: number): string {
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

export default {
  name: "trackStart",
  once: false,
  async execute(client: any, player: any, track: any) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    if (!channel) return;
    
    let thumbnail =
  track.info.thumbnail ??
  track.info.artworkUrl ??
  (track.info.identifier
    ? `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`
    : null);


    const embed = new EmbedBuilder()
      .setColor("#1DB954")
      .setAuthor({
         name: `Now Playing`,
         iconURL: "https://media.tenor.com/Sb0yPHMgNaUAAAAi/music-disc.gif",
            })
      .setDescription(`## **[${track.info.title}](${track.info.uri})**`)
      .addFields(
        { name: "<:author:1327309078585671823> Author", value: track.info.author || "Unknown", inline: true },
        {
          name: "<a:Duration:1244383251355926591> Duration",
          value: track.info.isStream ? "🔴 Livestream" : formatDuration(track.info.length),
          inline: true,
        },
                {
          name: "<:J_req:1249769826252230727> Requester",
          value: `<@${track.info.requester.id}>`,
          inline: true,
        }
      )
      .setImage(thumbnail)
      

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("pause_resume")
        .setEmoji("⏯️")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("skip")
        .setEmoji("⏭️")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("stop")
        .setEmoji("⏹️")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("volume_down")
        .setEmoji("🔉")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("volume_up")
        .setEmoji("🔊")
        .setStyle(ButtonStyle.Secondary)
    );

    const message = await channel.send({
      embeds: [embed],
      components: [row],
    });

    player.nowPlayingMessage = message;

    const collector = message.createMessageComponentCollector();

    collector.on("collect", async (interaction) => {
      if (!interaction.isButton()) return;

      const currentPlayer = client.riffy?.players.get(interaction.guildId);
      if (!currentPlayer) {
        return interaction.reply({ content: "❌ No player found.", flags: 1 << 6 });
      }

      const memberVC = interaction.member?.voice?.channelId;
      if (memberVC !== currentPlayer.voiceChannel) {
        return interaction.reply({
          content: "❌ You must be in the same voice channel as the bot.",
          flags: 1 << 6,
        });
      }

      switch (interaction.customId) {
        case "pause_resume":
          if (currentPlayer.paused) {
            currentPlayer.pause(false);
            interaction.reply({ content: "▶️ Resumed!", flags: 1 << 6 });
          } else {
            currentPlayer.pause(true);
            interaction.reply({ content: "⏸️ Paused!", flags: 1 << 6 });
          }
          break;

        case "skip":
          currentPlayer.stop();
          interaction.reply({ content: "⏭️ Skipped!", flags: 1 << 6 });
          break;

        case "stop":
          currentPlayer.stop();
          interaction.reply({ content: "⏹️ Stopped!", flags: 1 << 6 });

          
          try {
            await player.nowPlayingMessage?.delete();
          } catch {}
          player.nowPlayingMessage = null;

          break;

        case "volume_down":
          const volDown = Math.max(0, currentPlayer.volume - 10);
          currentPlayer.setVolume(volDown);
          interaction.reply({ content: `🔉 Volume: ${volDown}%`, flags: 1 << 6 });
          break;

        case "volume_up":
          const volUp = Math.min(100, currentPlayer.volume + 10);
          currentPlayer.setVolume(volUp);
          interaction.reply({ content: `🔊 Volume: ${volUp}%`, flags: 1 << 6 });
          break;
      }
    });
  },
};