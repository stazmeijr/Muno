"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
exports.default = {
    name: "nodeDestroy",
    execute(client, node) {
        logger_1.logger.warn(`[Riffy] ⚠️ Node "${node.name}" has been destroyed.`);
    },
};
