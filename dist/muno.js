"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const Client_1 = require("./classes/Client");
const logger_1 = require("./utils/logger");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const discord_js_2 = require("discord.js");
require("./utils/antiCrash");
const Database_1 = require("./classes/Database");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.commands = new discord_js_1.Collection();
client.cooldowns = new discord_js_1.Collection();
const riffy = new Client_1.RiffyClient(client);
client.riffy = riffy;
riffy.getSpotifyToken();
setInterval(() => riffy.getSpotifyToken(), 3000000);
client.once("ready", () => {
    client.riffy.init(client.user.id);
    logger_1.logger.info("INITIATING RIFFY CLIENT");
});
client.on("raw", (data) => {
    if ([
        discord_js_2.GatewayDispatchEvents.VoiceStateUpdate,
        discord_js_2.GatewayDispatchEvents.VoiceServerUpdate,
    ].includes(data.t)) {
        client.riffy?.updateVoiceState(data);
    }
});
// ====================
// Event Handler
// ====================
const eventsPath = path_1.default.join(__dirname, "events");
const categories = fs_1.default.existsSync(eventsPath) ? fs_1.default.readdirSync(eventsPath) : [];
for (const category of categories) {
    const categoryPath = path_1.default.join(eventsPath, category);
    if (!fs_1.default.statSync(categoryPath).isDirectory())
        continue;
    const eventFiles = fs_1.default
        .readdirSync(categoryPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of eventFiles) {
        const filePath = path_1.default.join(categoryPath, file);
        const event = require(filePath).default ?? require(filePath);
        if (!event?.name || typeof event.execute !== "function") {
            logger_1.logger.warn(`[Event] Skipped invalid: ${file}`);
            continue;
        }
        if (event.once) {
            if (category === "player") {
                client.riffy.once(event.name, (...args) => event.execute(client, ...args));
            }
            else {
                client.once(event.name, (...args) => event.execute(...args, client));
            }
        }
        else {
            if (category === "player") {
                client.riffy.on(event.name, (...args) => event.execute(client, ...args));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        logger_1.logger.success(`[Event] Loaded: ${file}`);
    }
}
// ====================
// Slash Command Handler
// ====================
const commands = [];
const foldersPath = path_1.default.join(__dirname, "commands");
const commandFolders = fs_1.default.existsSync(foldersPath)
    ? fs_1.default.readdirSync(foldersPath)
    : [];
for (const folder of commandFolders) {
    const commandsPath = path_1.default.join(foldersPath, folder);
    const commandFiles = fs_1.default
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        const command = require(filePath).default ?? require(filePath);
        if ("data" in command && "execute" in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            logger_1.logger.success(`[Command] Loaded: ${file}`);
        }
        else {
            logger_1.logger.warn(`[Command] Invalid: ${file}`);
        }
    }
}
const rest = new discord_js_1.REST({ version: "10" }).setToken(config_1.config.token);
(async () => {
    try {
        logger_1.logger.info("🔁 Connecting to MongoDB...");
        await Database_1.Database.connect();
        logger_1.logger.info("📤 Registering slash commands...");
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.clientId), { body: commands });
        logger_1.logger.success("✅ Slash commands registered!");
        await client.login(config_1.config.token);
    }
    catch (error) {
        logger_1.logger.error(error);
    }
})();
