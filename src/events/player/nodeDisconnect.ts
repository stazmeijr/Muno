import { logger } from "../../utils/logger";

export default {
  name: "nodeDisconnect",
  once: false,
  execute(client: any, node: any, reason: string) {
    logger.warn(`[Riffy] Node "${node.name}" disconnected. Reason: ${JSON.stringify(reason)}`);
  },
};