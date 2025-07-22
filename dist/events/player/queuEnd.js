"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "queueEnd",
    once: false,
    async execute(client, player) {
        const channel = client.channels.cache.get(player.textChannel);
        if (!channel)
            return;
        if (player.nowPlayingMessage) {
            try {
                await player.nowPlayingMessage.delete();
            }
            catch { }
            player.nowPlayingMessage = null;
        }
        player.leaveTimeout = setTimeout(() => {
            player.destroy();
        }, 180000);
    },
};
