import { Signale } from "signale";

export const logger = new Signale({
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