import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
} from "discord.js";

export default {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the music and leave the voice channel"),

  async execute(interaction: ChatInputCommandInteraction) {
    const client: any = interaction.client;
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;

    if (!guild || !member) {
      return interaction.reply({
        content: "❌ This command can only be used in a server.",
        ephemeral: true,
      });
    }

    const player = client.riffy?.players.get(guild.id);

    if (!player) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ No music is currently playing."),
        ],
        ephemeral: true,
      });
    }

    const userChannel = member.voice?.channel;

    if (!userChannel || userChannel.id !== player.voiceChannel) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setDescription("❌ You must be in the same voice channel as the bot."),
        ],
        ephemeral: true,
      });
    }

    player.destroy();

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("🛑 Music stopped and I’ve left the voice channel."),
      ],
    });
  },
};