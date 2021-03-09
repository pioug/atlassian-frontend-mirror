import {
  PollingOptions,
  getMediaFeatureFlag,
} from '@atlaskit/media-common/mediaFeatureFlags';

import { PollingError } from './errors';
import { Executor } from './types';

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

  async execute(executor: Executor): Promise<void> {
    const { poll_maxAttempts, poll_maxGlobalFailures } = this.options;

    if (PollingFunction.failures >= poll_maxGlobalFailures) {
      // hard kill, maximum failures on page allowed
      return this.fail(
        new PollingError('pollingMaxFailuresExceeded', this.attempt),
      );
    } else if (poll_maxAttempts === 0) {
      // hard kill, polling disabled
      return this.fail(
        new PollingError('pollingMaxAttemptsExceeded', this.attempt),
      );
    }

    try {
      // executor must explicitly call this.next() for triggering next iteration (pull)
      this.shouldIterate = false;
      await executor();

      if (!this.shouldIterate) {
        return;
      }

      if (this.attempt >= poll_maxAttempts) {
        // max iterations exceeded, let the consumer know
        return this.fail(
          new PollingError('pollingMaxAttemptsExceeded', this.attempt),
        );
      }

      this.poll_intervalMs = this.getIntervalMsForIteration(this.attempt);
      this.attempt++;
      this.timeoutId = window.setTimeout(
        () => this.execute(executor),
        this.poll_intervalMs,
      );
    } catch (error) {
      this.fail(error);
    }
  }

  private fail(error: Error) {
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
