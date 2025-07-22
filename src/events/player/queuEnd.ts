import { TextChannel } from "discord.js";

export default {
  name: "queueEnd",
  once: false,
  async execute(client: any, player: any) {
    const channel = client.channels.cache.get(player.textChannel) as TextChannel;
    if (!channel) return;


    if (player.nowPlayingMessage) {
      try {
        await player.nowPlayingMessage.delete();
      } catch {}
      player.nowPlayingMessage = null;
    }


    player.leaveTimeout = setTimeout(() => {
      player.destroy();
    }, 180000);
  },
};