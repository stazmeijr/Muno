import dotenv from "dotenv";
import { ActivityType, PresenceStatusData } from "discord.js";
import { Spotify } from "riffy-spotify";
dotenv.config();

export const config = {
  token: process.env.TOKEN as string,
  clientId: process.env.CLIENT_ID as string,
    mongoUri: process.env.MONGO_URI as string,

  spotify: {
    clientId: process.env.SPOTIFY_ID as string,
    clientSecret: process.env.SPOTIFY_SECRET as string,
  },

  riffyPlugins: [
    new Spotify({
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

  defaultPlatform: process.env.DEFAULT_PLATFORM,

  presence: {
    status: "dnd" as PresenceStatusData,
    activities: [
      {
        name: "/play",
        type: ActivityType.Listening,
      },
    ],
  },
};