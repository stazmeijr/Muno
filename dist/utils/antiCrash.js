"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
process.on("unhandledRejection", (reason, promise) => {
    logger_1.logger.error(`Unhandled Rejection: ${reason}`);
});
process.on("uncaughtException", (err) => {
    logger_1.logger.error(`Uncaught Exception: ${err}`);
});
process.on("uncaughtExceptionMonitor", (err) => {
    logger_1.logger.error(`Uncaught Exception Monitor: ${err}`);
});
