import { logger } from "../../utils/logger";

export default {
  name: "nodeConnect",
  once: false,
  async execute(client: any, node: any) {
    logger.info(`[Riffy] Node "${node.name}" connected successfully.`);
  },
};