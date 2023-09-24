import { Logger } from '@nestjs/common';

const logger = new Logger('Node-Test', {
  timestamp: true,
});

/**
 *
 * Custom utility to print console logs.
 * Methods include log, debug, error, which take one parameter message: any
 *
 */
export namespace LogUtil {
  export const log = (message: any) => {
    logger.log(message);
  };

  export const debug = (message: any) => {
    logger.debug(message);
  };

  export const error = (message: any) => {
    logger.error(message);
  };
}
