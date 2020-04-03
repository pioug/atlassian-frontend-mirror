import { sendToBridge } from '../../bridge-utils';
import { errorReporter } from '../../error-reporter';

jest.mock('../../bridge-utils', () => ({
  sendToBridge: jest.fn(),
}));

function createErrorEvent(
  message: string,
  filename: string,
  lineno: number,
  colno: number,
  stack?: string,
) {
  return {
    message,
    filename,
    lineno,
    colno,
    error: (() => {
      const error = new Error(message);
      error.stack = stack;
      return error;
    })(),
  } as ErrorEvent;
}

beforeEach(() => {});

describe('error reporter', () => {
  it('should call sendtoBridge() with stack trace', () => {
    const errorEvent = createErrorEvent(
      'message',
      'filename',
      1,
      2,
      'line 1\n     line 2',
    );

    errorReporter(errorEvent);

    expect(sendToBridge).toHaveBeenCalledWith(
      'errorBridge',
      'sendError',
      expect.objectContaining({
        message: 'message',
        source: 'filename',
        line: 1,
        col: 2,
        stackTrace: ['line 1', 'line 2'],
      }),
    );
  });

  it('should call sendtoBridge() without stack trace', () => {
    const errorEvent = createErrorEvent('message', 'filename', 2, 3);

    errorReporter(errorEvent);

    expect(sendToBridge).toHaveBeenCalledWith(
      'errorBridge',
      'sendError',
      expect.objectContaining({
        message: 'message',
        source: 'filename',
        line: 2,
        col: 3,
      }),
    );
  });
});
