import { sendToBridge } from './bridge-utils';

export interface ErrorBridge {
  sendError(
    message: string,
    source: string,
    line: number,
    col: number,
    stackTrace: string[],
  ): void;
}

export interface RuntimeBridges {
  errorBridge?: ErrorBridge;
}

export class RuntimeBridgeImpl implements RuntimeBridges {
  errorBridge?: ErrorBridge;

  call<T extends keyof RuntimeBridges>(
    bridge: T,
    event: keyof Exclude<RuntimeBridges[T], undefined>,
    ...args: any
  ) {
    sendToBridge(bridge, event, ...args);
  }
}

export const toRuntimeBridge = new RuntimeBridgeImpl();

export function errorReporter(event: ErrorEvent) {
  const { message, filename, lineno: line, colno: col, error } = event;

  toRuntimeBridge.call('errorBridge', 'sendError', {
    message,
    source: filename || '',
    line,
    col,
    stackTrace:
      (error &&
        error.stack &&
        error.stack.split('\n').map((trace: string) => trace.trim())) ||
      [],
  });
}

// Global error listener
window.addEventListener('error', errorReporter);
