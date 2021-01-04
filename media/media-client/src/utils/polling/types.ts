export type Executor = () => Promise<void>;

export type PollingErrorReason = 'maxAttemptsExceeded' | 'maxFailuresExceeded';

export type PollingErrorAttributes = {
  readonly reason: PollingErrorReason;
  readonly attempts: number;
  readonly innerError?: Error;
};
