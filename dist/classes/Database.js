"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
class Database {
    static async connect() {
        try {
            await mongoose_1.default.connect(config_1.config.mongoUri);
            logger_1.logger.success("✅ MongoDB Connected");
        }
        catch (err) {
            logger_1.logger.error("❌ MongoDB Connection Error:", err);
        }
    }
}
exports.Database = Database;
