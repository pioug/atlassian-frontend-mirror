/* eslint-disable no-console */

export const LOG_LEVEL = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  OFF: 4,
};

export default class Logger {
  logLevel: number = LOG_LEVEL.OFF;

  constructor({ logLevel }: { logLevel?: number } = {}) {
    if (typeof logLevel === 'number') {
      this.setLogLevel(logLevel);
    }
  }

  setLogLevel(logLevel: number) {
    if (logLevel >= LOG_LEVEL.DEBUG && logLevel <= LOG_LEVEL.OFF) {
      this.logLevel = +logLevel;
    } else {
      this.logLevel = LOG_LEVEL.OFF;
    }
  }

  logMessage(level: number, type: keyof Console, ...args: any[]) {
    if (level >= this.logLevel) {
      console[type](...args);
    }
  }

  debug(...args: any[]) {
    this.logMessage(LOG_LEVEL.DEBUG, 'log', ...args);
  }

  info(...args: any[]) {
    this.logMessage(LOG_LEVEL.INFO, 'info', ...args);
  }

  warn(...args: any[]) {
    this.logMessage(LOG_LEVEL.WARN, 'warn', ...args);
  }

  error(...args: any[]) {
    this.logMessage(LOG_LEVEL.ERROR, 'error', ...args);
  }
}
