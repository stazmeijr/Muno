"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "trackEnd",
    once: false,
    async execute(client, player) {
        if (player.nowPlayingMessage) {
            try {
                await player.nowPlayingMessage.delete();
            }
            catch { }
            player.nowPlayingMessage = null;
        }
    },
};
