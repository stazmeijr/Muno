"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    cooldown: 5,
    data: new discord_js_1.SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Shows information about a user.")
        .addUserOption(option => option
        .setName("user")
        .setDescription("The user to get info of")
        .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild?.members.fetch(user.id).catch(() => null);
        const presence = member?.presence;
        const status = presence?.status || "offline";
        const statusEmoji = {
            online: "🟢 Online",
            idle: "🟡 Idle",
            dnd: "🔴 Do Not Disturb",
            offline: "⚫ Offline",
            invisible: "⚫ Invisible",
        };
        const statusText = statusEmoji[status] || "⚫ Offline";
        const activity = presence?.activities?.[0];
        const activityText = activity ? `${activity.name}` : "No current activity";
        let joinPosition = "Unknown";
        if (member?.joinedTimestamp && interaction.guild) {
            const members = await interaction.guild.members.fetch().catch(() => null);
            if (members) {
                const sorted = members.sort((a, b) => (a.joinedTimestamp || 0) - (b.joinedTimestamp || 0));
                const sortedArray = Array.from(sorted.values());
                const memberIndex = sortedArray.findIndex((m) => m.id === user.id);
                joinPosition = `#${memberIndex + 1}`;
            }
        }
        const boostingSince = member?.premiumSince;
        const boostText = boostingSince
            ? `Since ${boostingSince.toLocaleDateString()}`
            : "Not boosting this server";
        const embed = new discord_js_1.EmbedBuilder()
            //.setColor(0x0099ff)
            .setTitle(`User Information`)
            .setURL(`https://discord.com/users/${user.id}`)
            .setAuthor({
            name: user.tag,
            iconURL: user.displayAvatarURL({ forceStatic: false }),
            url: `https://discord.com/users/${user.id}`,
        })
            .setDescription(`Detailed information about **${member?.displayName || user.username}**`)
            .setThumbnail(user.displayAvatarURL({ size: 256, forceStatic: false }))
            .addFields({ name: "User ID", value: user.id }, { name: "\u200B", value: "\u200B" }, {
            name: "Account Created",
            value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`,
            inline: true,
        }, { name: "Bot Account", value: user.bot ? "✅ Yes" : "❌ No", inline: true }, { name: "Status", value: statusText, inline: true });
        if (member) {
            embed.addFields({ name: "\u200B", value: "\u200B" }, { name: "Server Information", value: "Member details for this server" }, {
                name: "Joined Server",
                value: member.joinedTimestamp
                    ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
                    : "Unknown",
                inline: true,
            }, { name: "Join Position", value: joinPosition, inline: true }, { name: "Server Nickname", value: member.nickname || "None", inline: true }, { name: "Highest Role", value: member.roles.highest.toString(), inline: true }, {
                name: "Role Count",
                value: `${member.roles.cache.size - 1} roles`,
                inline: true,
            }, { name: "Boosting Status", value: boostText, inline: true }, { name: "\u200B", value: "\u200B" }, { name: "Current Activity", value: activityText });
            const roles = member.roles.cache
                .filter(role => role.name !== "@everyone")
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, 10);
            if (roles.length > 0) {
                embed.addFields({
                    name: `Roles [${member.roles.cache.size - 1}]`,
                    value: roles.join(" "),
                });
            }
            const importantPerms = member.permissions
                .toArray()
                .filter(perm => [
                "Administrator",
                "ManageGuild",
                "ManageRoles",
                "ManageChannels",
                "BanMembers",
                "KickMembers",
                "ManageMessages",
            ].includes(perm));
            if (importantPerms.length > 0) {
                embed.addFields({
                    name: "Key Permissions",
                    value: importantPerms.slice(0, 5).join(", "),
                });
            }
        }
        embed
            .setImage(user.displayAvatarURL({ size: 512, forceStatic: false }))
            .setFooter({
            text: `Requested by ${interaction.user.tag} • ${new Date().toLocaleDateString()}`,
            iconURL: interaction.user.displayAvatarURL({ size: 64 }),
        })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
    },
};
