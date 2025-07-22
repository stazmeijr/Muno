"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../../utils/logger");
exports.default = {
    name: "nodeConnect",
    once: false,
    async execute(client, node) {
        logger_1.logger.info(`[Riffy] Node "${node.name}" connected successfully.`);
    },
};
