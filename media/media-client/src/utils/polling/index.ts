import { PollingError } from './errors';
import { Executor } from './types';

export interface PollingOptions {
  poll_intervalMs: number;
  poll_maxAttempts: number;
  poll_backoffFactor: number;
  poll_maxIntervalMs: number;
}

// default polling options without using feature flags
export const defaultPollingOptions: PollingOptions = {
  poll_intervalMs: 3000,
  poll_maxAttempts: 30,
  poll_backoffFactor: 1.25,
  poll_maxIntervalMs: 200000,
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
  options: PollingOptions;
  poll_intervalMs: number = 0;
  attempt: number = 1;
  shouldIterate: boolean = true;
  onError?: (error: Error) => void;
  timeoutId: number = 0;

  constructor(options?: Partial<PollingOptions>) {
    this.options = {
      ...defaultPollingOptions,
      ...options,
    };
    this.poll_intervalMs = this.options.poll_intervalMs;
  }

  async execute(executor: Executor): Promise<void> {
    const { poll_maxAttempts } = this.options;

    if (poll_maxAttempts === 0) {
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
      this.fail(error as Error);
    }
  }

  private fail(error: Error) {
    const { onError } = this;
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
