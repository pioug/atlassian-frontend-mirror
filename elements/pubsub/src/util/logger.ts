let debugEnabled = false;
let stacktracesEnabled = false;

const LOG_PREFIX = '[Frontend PubSub] ';
export function enableLogger(enable: boolean): void {
  debugEnabled = enable;
}

export function enableStacktraces(enable: boolean): void {
  stacktracesEnabled = enable;
}

export function logStacktrace(): void {
  if (stacktracesEnabled) {
    // eslint-disable-next-line no-console
    console.log(new Error().stack);
  }
}

export function logDebug(msg: any, ...args: any[]): void {
  if (debugEnabled) {
    // eslint-disable-next-line no-console
    console.log(LOG_PREFIX + msg, ...args);
  }
}

export function logInfo(msg: any, ...args: any[]): void {
  // eslint-disable-next-line no-console
  console.info(LOG_PREFIX + msg, ...args);
}

export function logError(msg: any, ...args: any[]): void {
  // eslint-disable-next-line no-console
  console.error(LOG_PREFIX + msg, ...args);
}
