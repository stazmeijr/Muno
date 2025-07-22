"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./utils/logger");
const manager = new discord_js_1.ShardingManager(path_1.default.join(__dirname, "muno.js"), {
    token: config_1.config.token,
    totalShards: "auto",
});
const logoPath = path_1.default.join(__dirname, "./utils/logo.txt");
const logo = fs_1.default.readFileSync(logoPath, "utf-8");
console.log(logo);
manager.on("shardCreate", (shard) => {
    logger_1.logger.start(`Launched Shard #${shard.id}`);
});
manager.spawn({ timeout: -1 });
