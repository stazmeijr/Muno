"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
exports.default = {
    name: "nodeDisconnect",
    once: false,
    execute(client, node, reason) {
        logger_1.logger.warn(`[Riffy] Node "${node.name}" disconnected. Reason: ${JSON.stringify(reason)}`);
    },
};
