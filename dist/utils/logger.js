"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const signale_1 = require("signale");
exports.logger = new signale_1.Signale({
    scope: "Muno",
    logLevel: "info",
    types: {
        success: {
            badge: "✔",
            color: "green",
            label: "success",
        },
        error: {
            badge: "✖",
            color: "red",
            label: "error",
        },
        warn: {
            badge: "⚠",
            color: "yellow",
            label: "warn",
        },
        info: {
            badge: "ℹ",
            color: "blue",
            label: "info",
        },
        start: {
            badge: "▶",
            color: "green",
            label: "start",
        },
    },
});
