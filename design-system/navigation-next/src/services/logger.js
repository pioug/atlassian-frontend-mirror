/* eslint-disable no-console */
/**
 * A logger service that logs debug messages to the console if the debug option is set to true
 */
export default class Logger {
  debugEnabled = false;

  prefix = '';

  groupCount = 0;

  constructor({ debug, prefix }) {
    if (debug != null) {
      this.debugEnabled = debug;
    }
    if (prefix != null) {
      this.prefix = `${prefix}:`;
    }
  }

  setDebug(enabled) {
    this.debugEnabled = enabled;
  }

  processArgs(...args) {
    if (!this.debugEnabled) {
      return null;
    }
    const logArgs = args;
    const { prefix } = this;
    if (prefix && this.groupCount === 0) {
      if (typeof logArgs[0] === 'string') {
        logArgs[0] = `${prefix} ${logArgs[0]}`;
      } else {
        logArgs.unshift(prefix);
      }
    }

    return logArgs;
  }

  debug(...args) {
    const processedArgs = this.processArgs(...args);
    if (!processedArgs) {
      return;
    }
    console.log(...processedArgs);
  }

  debugConditional(condition, ...args) {
    if (!condition) {
      return;
    }
    this.debug(...args);
  }

  debugGroup(...args) {
    const processedArgs = this.processArgs(...args);
    if (!processedArgs) {
      return;
    }
    console.group(...processedArgs);
    this.groupCount++;
  }

  debugGroupCollapsed(...args) {
    const processedArgs = this.processArgs(...args);
    if (!processedArgs) {
      return;
    }
    console.groupCollapsed(...processedArgs);
    this.groupCount++;
  }

  debugGroupEnd(...args) {
    const processedArgs = this.processArgs(...args);
    if (!processedArgs) {
      return;
    }
    console.groupEnd(...processedArgs);
    this.groupCount--;
  }
}
