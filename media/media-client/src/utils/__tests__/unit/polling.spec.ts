import { PollingOptions } from '@atlaskit/media-common/mediaFeatureFlags';

import { defaultPollingOptions, PollingFunction } from '../../polling';
import { isPollingError, PollingError } from '../../polling/errors';

const simulateTimeout = (poll_intervalMs: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, poll_intervalMs);
  });

describe('Polling Function', () => {
  const options = {
    poll_intervalMs: 3,
    poll_maxAttempts: 5,
    poll_backoffFactor: 1.25,
    poll_maxIntervalMs: 100,
  } as PollingOptions;

  it('should use default options if none given', () => {
    const poll = new PollingFunction();
    expect(poll.options.poll_intervalMs).toBe(
      defaultPollingOptions.poll_intervalMs,
    );
    expect(poll.options.poll_maxAttempts).toBe(
      defaultPollingOptions.poll_maxAttempts,
    );
    expect(poll.options.poll_backoffFactor).toBe(
      defaultPollingOptions.poll_backoffFactor,
    );
  });

  it('should initialise to given interval', () => {
    const poll = new PollingFunction(options);
    expect(poll.poll_intervalMs).toBe(options.poll_intervalMs);
  });

  it.each([
    [1, 3000],
    [2, 3750],
    [3, 4688],
    [4, 5859],
    [5, 7324],
    [6, 9155],
    [7, 11444],
  ])(
    'should calculate correct timeout for iteration %p using backoff',
    (iteration, expectedIntervalMs) => {
      const poll = new PollingFunction(defaultPollingOptions);
      expect(poll.getIntervalMsForIteration(iteration)).toBe(
        expectedIntervalMs,
      );
    },
  );

  // Change this test from .skip to .only to print interval values from given settings
  // NOTE:  Polling attempts begin after the first invokation of the executor.
  //        Therefore the "1st polling attempt" is actually the 2nd time the executor has been called.
  //        The initial executor invokation is called immedately without any delay.
  it.skip('display intervals and total span', () => {
    const opts = {
      ...defaultPollingOptions,
    };
    const poll = new PollingFunction(opts);
    let spanIntervalMs = 0;
    let output = '';
    for (let i = 1; i <= opts.poll_maxAttempts; i++) {
      const poll_intervalMs = poll.getIntervalMsForIteration(i);
      spanIntervalMs += poll_intervalMs;
      output += `Iteration: ${i} poll_intervalMs: ${poll_intervalMs}ms\n`;
    }
    output += `Total span: ${spanIntervalMs}ms (${spanIntervalMs / 1000}s) (${
      spanIntervalMs / 1000 / 60
    })m\n`;
    expect(true).toBeTruthy();
    // eslint-disable-next-line no-console
    console.log(output);
  });

  it('should limit poll_intervalMs to poll_maxIntervalMs', () => {
    const poll = new PollingFunction(options);
    expect(poll.getIntervalMsForIteration(100000)).toBe(
      options.poll_maxIntervalMs,
    );
  });

  it('should not iterate unless .next() called', async (done) => {
    const poll = new PollingFunction(options);
    const executor = jest.fn().mockResolvedValue(undefined);
    poll.execute(executor);
    await simulateTimeout(poll.poll_intervalMs);
    expect(executor).toBeCalledTimes(1);
    done();
  });

  it('should iterate when .next() called', async (done) => {
    const poll = new PollingFunction(options);
    const executor = jest.fn().mockImplementation(() => {
      poll.next();
    });
    poll.execute(executor);
    await simulateTimeout(poll.getIntervalMsForIteration(1));
    await simulateTimeout(poll.getIntervalMsForIteration(2));
    expect(executor).toBeCalledTimes(2);
    done();
  });

  it('should call onError when max iterations reached', async (done) => {
    const poll = new PollingFunction({
      ...options,
      poll_maxAttempts: 1,
    });
    const executor = jest.fn().mockImplementation(() => poll.next());
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    poll.execute(executor);
    await simulateTimeout(poll.getIntervalMsForIteration(1));
    expect(mockOnError).toHaveBeenCalledTimes(1);
    const errorThrown = mockOnError.mock.calls[0][0] as Error;

    if (!isPollingError(errorThrown)) {
      return expect(isPollingError(errorThrown)).toBeTruthy();
    }

    expect(errorThrown.attributes.reason).toEqual('pollingMaxAttemptsExceeded');
    expect(errorThrown.attributes.attempts).toBe(1);
    done();
  });

  it('should call onError if executor has exception', async (done) => {
    const err = new Error('some-error');
    const poll = new PollingFunction({
      ...options,
      poll_maxAttempts: 1,
    });
    const executor = jest.fn().mockImplementation(() => {
      throw err;
    });
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    await poll.execute(executor);
    expect(mockOnError).toHaveBeenCalledTimes(1);
    const errorThrown = mockOnError.mock.calls[0][0] as Error;
    expect(errorThrown).toEqual(err);
    done();
  });

  it('should not call executor if poll_maxAttempts is set to zero (hard kill)', async (done) => {
    const poll = new PollingFunction({
      ...options,
      poll_maxAttempts: 0,
    });
    const executor = jest.fn();
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    await poll.execute(executor);
    expect(executor).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledTimes(1);
    done();
  });

  it('should clear timeout if cancel() called', async (done) => {
    const originalFn = window.clearTimeout;
    const mockClearTimeout = jest.fn();
    window.clearTimeout = mockClearTimeout;

    const poll = new PollingFunction({
      ...options,
    });
    const executor = jest.fn().mockImplementation(() => {
      poll.next();
    });
    poll.execute(executor);
    await simulateTimeout(poll.getIntervalMsForIteration(1));
    expect(poll.timeoutId).toBeGreaterThan(0);
    poll.cancel();
    expect(mockClearTimeout).toHaveBeenCalled();
    expect(poll.timeoutId).toBe(0);
    window.clearTimeout = originalFn;
    done();
  });

  it('should detect a polling error', () => {
    const error2 = new PollingError('pollingMaxAttemptsExceeded', 1);
    const error4 = new Error();
    expect(isPollingError(error2)).toBeTruthy();
    expect(isPollingError(error4)).toBeFalsy();
  });
});
