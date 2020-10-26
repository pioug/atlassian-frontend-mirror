import {
  PollingOptions,
  getMediaFeatureFlag,
} from '@atlaskit/media-common/mediaFeatureFlags';

export type Executor = () => Promise<void>;

export const ERROR_MAX_ATTEMPTS_EXCEEDED = 'Maximum attempts exceeded';
export const ERROR_MAX_FAILURES_EXCEEDED = 'Maximum failures exceeded';

export const defaultPollingOptions: Required<PollingOptions> = {
  poll_intervalMs: getMediaFeatureFlag('poll_intervalMs') as number,
  poll_maxAttempts: getMediaFeatureFlag('poll_maxAttempts') as number,
  poll_backoffFactor: getMediaFeatureFlag('poll_backoffFactor') as number,
  poll_maxIntervalMs: getMediaFeatureFlag('poll_maxIntervalMs') as number,
  poll_maxGlobalFailures: getMediaFeatureFlag(
    'poll_maxGlobalFailures',
  ) as number,
};

/**
 * This class encapsulates polling functionality with the following features:
 *
 *  - async executor function provides each attempt
 *  - executor will only repeat defined max amount of times (options)
 *  - each attempt uses a timeout to the next attempt by an interval (ms)
 *  - each attempt increases the timeout interval by a "poll_backoffFactor"
 *  - if max attempts are exceeded or executor has exception then onError handler is called
 *
 * IMPORTANT! the executor function must explicitly call ".next()" for the next iteration to run
 */
export class PollingFunction {
  options: Required<PollingOptions>;
  poll_intervalMs: number = 0;
  attempt: number = 1;
  shouldIterate: boolean = true;
  onError?: (error: Error) => void;
  timeoutId: number = 0;

  // This static value tracks all failures of any invoker.
  // poll_maxAttempts is per invoker, whereas this static value is global for the page.
  // This limits overall polling on page instead of just one invoker.
  static failures: number = 0;

  constructor(options?: Partial<PollingOptions>) {
    this.options = {
      ...defaultPollingOptions,
      ...options,
    };
    this.poll_intervalMs = this.options.poll_intervalMs;
  }

  async execute(executor: Executor) {
    const { poll_maxAttempts, poll_maxGlobalFailures } = this.options;

    if (PollingFunction.failures >= poll_maxGlobalFailures) {
      // hard kill, maximum failures on page allowed
      return this.fail(new Error(ERROR_MAX_FAILURES_EXCEEDED));
    } else if (poll_maxAttempts === 0) {
      // hard kill, polling disabled
      return this.fail(new Error(ERROR_MAX_ATTEMPTS_EXCEEDED));
    }

    try {
      // executor must explicitly call this.next() for next iteration, defaults to false
      this.shouldIterate = false;
      await executor();

      if (this.shouldIterate) {
        this.attempt++;
        if (this.attempt <= poll_maxAttempts) {
          this.poll_intervalMs = this.getIntervalMsForIteration(
            this.attempt - 1,
          );
          this.timeoutId = window.setTimeout(
            () => this.execute(executor),
            this.poll_intervalMs,
          );
        } else {
          // max iterations exceeded, let the consumer know
          this.fail(new Error(ERROR_MAX_ATTEMPTS_EXCEEDED));
        }
      }
    } catch (e) {
      this.fail(e);
    }
  }

  fail(error: Error) {
    const { onError } = this;
    PollingFunction.failures += 1;
    this.cancel();
    onError && onError(error);
  }

  getIntervalMsForIteration(iteration: number) {
    let poll_intervalMs = this.options.poll_intervalMs;
    if (iteration === 1) {
      return poll_intervalMs;
    }
    for (let i = 2; i <= iteration; i++) {
      poll_intervalMs = poll_intervalMs * this.options.poll_backoffFactor;
    }
    return Math.min(
      Math.round(poll_intervalMs),
      this.options.poll_maxIntervalMs,
    );
  }

  next() {
    this.shouldIterate = true;
  }

  cancel() {
    window.clearTimeout(this.timeoutId);
    this.timeoutId = 0;
  }
}
