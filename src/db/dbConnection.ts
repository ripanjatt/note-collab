import { connect } from 'mongoose';
import { LogUtil } from 'src/utils/customLogger';

/**
 *
 * Connects to mongodb using connection string provided in .env file
 *
 */
export class DbConnection {
  constructor() {
    connect(process.env.DB_CONN_STRING)
      .then(() => {
        LogUtil.log('Application connected to db successfully');
      })
      .catch((err: Error) => {
        LogUtil.error(err.stack);
      });
  }
}
