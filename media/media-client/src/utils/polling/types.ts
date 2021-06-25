export type Executor = () => Promise<void>;

export type PollingErrorReason = 'pollingMaxAttemptsExceeded';

export type PollingErrorAttributes = {
  readonly reason: PollingErrorReason;
  readonly attempts: number;
  readonly innerError?: Error;
};
