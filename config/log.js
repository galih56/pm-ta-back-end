// config/log.js

const { version } = require('../package');

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, colorize, label, printf, align } = format;
const { SPLAT } = require('triple-beam');
const { isObject } = require('lodash');

function formatObject(param) {
  if (isObject(param)) {
    return JSON.stringify(param);
  }
  return param;
}

// Ignore log messages if they have { private: true }
const all = format((info) => {
  const splat = info[SPLAT] || [];
  const message = formatObject(info.message);
  const rest = splat.map(formatObject).join(' ');
  info.message = `${message} ${rest}`;
  return info;
});

const customLogger = createLogger({
  format: combine(
    all(),
    label({ label: version }),
    timestamp(),
    colorize(),
    align(),
    printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${formatObject(info.message)}`)
  ),
  transports: [new transports.Console()]
});

module.exports.log = {
  custom: customLogger,
  inspect: false
  // level: 'info'
};