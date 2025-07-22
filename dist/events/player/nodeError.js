"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
exports.default = {
    name: "nodeError",
    once: false,
    execute(client, node, error) {
        logger_1.logger.error(`[Riffy] Node "${node.name}" encountered an error:\n${error.stack || error.message}`);
    },
};
