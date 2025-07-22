import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import { formatProgresBar } from "../../utils/formatProgresBar";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("Show the currently playing song"),

  async execute(interaction: ChatInputCommandInteraction) {
    const client: any = interaction.client;
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice?.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ You must be in a voice channel to use this command!",
        ephemeral: true,
      });
    }

    const player = client.riffy.players.get(interaction.guildId!);
    if (!player || !player.current) {
      return interaction.reply({
        content: "❌ Nothing is currently playing.",
        ephemeral: true,
      });
    }

    const current = player.current;
    const progress = formatProgresBar(player.position, current.info.length);

    const embed = new EmbedBuilder()
      .setColor("#1DB954")
      .setAuthor({
        name: "Now Playing 🎶",
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(
        `**[${current.info.title}](${current.info.uri})**\n${progress}`
      )
      
      .setFooter({
        text: `Requested by ${current.info.requester.username || "Unknown"}`,
        iconURL: current.info.requester.displayAvatarURL?.() || "",
      });

    return interaction.reply({ embeds: [embed] });
  },
};