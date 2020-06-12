const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, colorize } = format;

module.exports = context => {
  return createLogger({
    defaultMeta: context,
    format: combine(timestamp(), prettyPrint(), colorize()),
    transports: [new transports.Console()]
  });
};
