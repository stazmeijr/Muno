export default {
  name: "trackEnd",
  once: false,
  async execute(client: any, player: any) {
    if (player.nowPlayingMessage) {
      try {
        await player.nowPlayingMessage.delete();
      } catch {}
      player.nowPlayingMessage = null;
    }
  },
};