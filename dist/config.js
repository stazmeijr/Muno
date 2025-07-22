"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = require("discord.js");
const riffy_spotify_1 = require("riffy-spotify");
dotenv_1.default.config();
exports.config = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    mongoUri: process.env.MONGO_URI,
    spotify: {
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
    },
    riffyPlugins: [
        new riffy_spotify_1.Spotify({
            clientId: process.env.SPOTIFY_ID || "",
            clientSecret: process.env.SPOTIFY_SECRET || "",
        }),
    ],
    nodes: [
        {
            name: "Muno",
            host: process.env.LAVALINK_HOST || "localhost",
            port: Number(process.env.LAVALINK_PORT) || 2333,
            password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
            secure: true,
            resumeKey: "riffy-resume",
            resumeTimeout: Number(process.env.RESUME_TIMEOUT) || 60,
        },
    ],
    defaultPlatform: process.env.DEFAULT_PLATFORM || "",
    presence: {
        status: "dnd",
        activities: [
            {
                name: "/play",
                type: discord_js_1.ActivityType.Listening,
            },
        ],
    },
};
