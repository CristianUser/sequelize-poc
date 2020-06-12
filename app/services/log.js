const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint, colorize } = format;

module.exports = context => {
  if (context.file) {
    const filePath = path.relative(process.cwd(), context.file);

    context.file = filePath;
  }

  return createLogger({
    defaultMeta: context,
    format: combine(timestamp(), prettyPrint(), colorize()),
    transports: [new transports.Console()]
  });
};
