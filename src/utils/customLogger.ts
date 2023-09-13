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
export class LogUtil {
  static log = (message: any) => {
    logger.log(message);
  };

  static debug = (message: any) => {
    logger.debug(message);
  };

  static error = (message: any) => {
    logger.error(message);
  };
}
