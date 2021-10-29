class UFOLogger {
  enabled = false;
  static UFOprefix = '[ufo🛸]';

  log(...args: Array<any>) {
    // eslint-disable-next-line no-console
    this.enabled && console.log(UFOLogger.UFOprefix, ...args);
  }
  warn(...args: Array<any>) {
    // eslint-disable-next-line no-console
    this.enabled && console.warn(UFOLogger.UFOprefix, ...args);
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

export const ufologger = new UFOLogger();

export const ufolog = (...args: Array<any>) => {
  ufologger.log(...args);
};

export const ufowarn = (...args: Array<any>) => {
  ufologger.warn(...args);
};
