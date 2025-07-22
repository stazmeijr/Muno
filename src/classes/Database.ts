import mongoose from "mongoose";
import { config } from "../config";
import { logger } from "../utils/logger";

export class Database {
  static async connect() {
    try {
      await mongoose.connect(config.mongoUri);
      logger.success("✅ MongoDB Connected");
    } catch (err) {
      logger.error("❌ MongoDB Connection Error:", err);
    }
  }
}