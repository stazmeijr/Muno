import { logger } from "../../utils/logger";

export default {
  name: "nodeError",
  once: false,
  execute(client: any, node: any, error: Error) {
    logger.error(`[Riffy] Node "${node.name}" encountered an error:\n${error.stack || error.message}`);
  },
};