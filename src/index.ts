import { ShardingManager } from "discord.js";
import { config } from "./config";
import path from "path";
import fs from "fs";
import { logger } from "./utils/logger";


const manager = new ShardingManager(path.join(__dirname, "muno.js"), {
  token: config.token,
  totalShards: "auto",
});


const logoPath = path.join(__dirname, "./utils/logo.txt");
const logo = fs.readFileSync(logoPath, "utf-8");
console.log(logo);


manager.on("shardCreate", (shard) => {
  logger.start(`Launched Shard #${shard.id}`);
});


manager.spawn({ timeout: -1 });