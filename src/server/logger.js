import winston from 'winston';

const options = {
  file: {
    level: 'info',
    filename: `app.log`,
    handleExceptions: true,
    json: false,
    maxsize: 10485760, // 10MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message.trim());
  },
};

export default logger;
