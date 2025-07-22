"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiffyClient = void 0;
const riffy_1 = require("riffy");
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
class RiffyClient extends riffy_1.Riffy {
    constructor(client) {
        const spotify = new spotify_web_api_node_1.default({
            clientId: config_1.config.spotify.clientId,
            clientSecret: config_1.config.spotify.clientSecret,
        });
        super(client, config_1.config.nodes, {
            send: (payload) => {
                const guild = client.guilds.cache.get(payload.d.guild_id);
                if (guild)
                    guild.shard.send(payload);
            },
            defaultSearchPlatform: config_1.config.defaultPlatform,
            restVersion: "v4",
            plugins: config_1.config.riffyPlugins,
            bypassChecks: {
                nodeFetchInfo: true,
            },
        });
        this.spotify = spotify;
    }
    async getSpotifyToken() {
        try {
            const data = await this.spotify.clientCredentialsGrant();
            this.spotify.setAccessToken(data.body.access_token);
            logger_1.logger.success("✅ Spotify token updated");
        }
        catch (error) {
            logger_1.logger.error("❌ Error getting Spotify token");
        }
    }
}
exports.RiffyClient = RiffyClient;
