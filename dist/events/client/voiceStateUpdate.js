"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: "voiceStateUpdate",
    once: false,
    async execute(oldState, newState) {
        const client = oldState.client;
        const guildId = oldState.guild.id;
        const player = client.riffy?.players.get(guildId);
        if (!player)
            return;
        const channel = oldState.guild.channels.cache.get(player.voiceChannel);
        if (!channel?.isVoiceBased())
            return;
        const members = channel.members.filter((member) => !member.user.bot);
        if (members.size === 0) {
            if (player.leaveTimeout)
                return;
            const textChannel = client.channels.cache.get(player.textChannel);
            player.leaveTimeout = setTimeout(async () => {
                if (player.nowPlayingMessage) {
                    try {
                        await player.nowPlayingMessage.delete();
                    }
                    catch { }
                    player.nowPlayingMessage = null;
                }
                player.destroy();
                delete player.leaveTimeout;
            }, 180000);
        }
        else {
            if (player.leaveTimeout) {
                clearTimeout(player.leaveTimeout);
                delete player.leaveTimeout;
            }
        }
    },
};
