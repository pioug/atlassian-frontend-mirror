import { PollingOptions } from '@atlaskit/media-common/mediaFeatureFlags';
import {
  PollingFunction,
  ERROR_MAX_ATTEMPTS_EXCEEDED,
  ERROR_MAX_FAILURES_EXCEEDED,
  defaultPollingOptions,
} from '../../polling';

const simulateTimeout = (poll_intervalMs: number) =>
  new Promise(resolve => {
    window.setTimeout(() => resolve(), poll_intervalMs);
  });

describe('Polling Function', () => {
  const options = {
    poll_intervalMs: 3,
    poll_maxAttempts: 5,
    poll_backoffFactor: 1.25,
    poll_maxIntervalMs: 100,
    poll_maxGlobalFailures: 10,
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

  // this test can be used to tune the options and display the values of iterations
  // not technically a test and skipped by default, but useful if needed
  it.skip('display intervals and total span', () => {
    const opts = {
      poll_intervalMs: 3000,
      poll_maxAttempts: 7,
      poll_backoffFactor: 1.75,
      poll_maxIntervalMs: 40000,
    };
    const poll = new PollingFunction(opts);
    let spanIntervalMs = 0;
    for (let i = 1; i <= opts.poll_maxAttempts; i++) {
      const poll_intervalMs = poll.getIntervalMsForIteration(i);
      spanIntervalMs += poll_intervalMs;
      // eslint-disable-next-line no-console
      console.log(`Iteration: ${i} poll_intervalMs: ${poll_intervalMs}ms`);
    }
    // eslint-disable-next-line no-console
    console.log(
      `Total span: ${spanIntervalMs}ms (${spanIntervalMs / 1000}s) (${
        spanIntervalMs / 1000 / 60
      })m`,
    );
    expect(true).toBeTruthy();
  });

  it('should limit poll_intervalMs to poll_maxIntervalMs', () => {
    const poll = new PollingFunction(options);
    expect(poll.getIntervalMsForIteration(100000)).toBe(
      options.poll_maxIntervalMs,
    );
  });

  it('should not iterate unless .next() called', async done => {
    const poll = new PollingFunction(options);
    const executor = jest.fn().mockResolvedValue(undefined);
    poll.execute(executor);
    await simulateTimeout(poll.poll_intervalMs);
    expect(executor).toBeCalledTimes(1);
    done();
  });

  it('should iterate when .next() called', async done => {
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

  it('should call onError when max iterations reached', async done => {
    const poll = new PollingFunction({
      ...options,
      poll_maxAttempts: 1,
    });
    const executor = jest.fn().mockImplementation(() => {
      poll.next();
    });
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    poll.execute(executor);
    await simulateTimeout(poll.getIntervalMsForIteration(1));
    expect(mockOnError).toHaveBeenCalledTimes(1);
    const errorThrown = mockOnError.mock.calls[0][0] as Error;
    expect(errorThrown.message).toBe(ERROR_MAX_ATTEMPTS_EXCEEDED);
    done();
  });

  it('should call onError if executor has exception', async done => {
    const poll = new PollingFunction({
      ...options,
      poll_maxAttempts: 1,
    });
    const executor = jest.fn().mockImplementation(() => {
      throw new Error('some-error');
    });
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    await poll.execute(executor);
    expect(mockOnError).toHaveBeenCalledTimes(1);
    const errorThrown = mockOnError.mock.calls[0][0] as Error;
    expect(errorThrown.message).toBe('some-error');
    done();
  });

  it('should not call executor if poll_maxAttempts is set to zero (hard kill)', async done => {
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

  it('should clear timeout if cancel() called', async done => {
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

  it('should not call executor if maxFailures has exceeded poll_maxGlobalFailures (hard kill)', async done => {
    const poll = new PollingFunction({
      ...options,
      poll_maxGlobalFailures: 5,
    });
    const originalMaxFailures = PollingFunction.failures;
    PollingFunction.failures = 5;
    const executor = jest.fn();
    const mockOnError = jest.fn();
    poll.onError = mockOnError;
    await poll.execute(executor);
    expect(executor).not.toHaveBeenCalled();
    expect(mockOnError).toHaveBeenCalledTimes(1);
    const errorThrown = mockOnError.mock.calls[0][0] as Error;
    expect(errorThrown.message).toBe(ERROR_MAX_FAILURES_EXCEEDED);
    PollingFunction.failures = originalMaxFailures;
    done();
  });

  it('should increment static failures count when fails', async done => {
    const poll = new PollingFunction({
      ...options,
    });
    const executor = jest.fn().mockImplementation(() => {
      throw new Error('some-error');
    });
    PollingFunction.failures = 0;
    await poll.execute(executor);
    expect(PollingFunction.failures).toBe(1);
    done();
  });
});
