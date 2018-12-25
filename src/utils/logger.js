const winston = require('winston');
const fs = require('fs');

/**
 * The logger that we will use throughout the application.
 *
 * Currently everything is configured to log to stdout for docker.
 *
 * @see {@link https://github.com/winstonjs/winston winston}
 */
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Stream({
      stream: fs.createWriteStream('/dev/null'),
    }),
  ],
});

/**
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;
