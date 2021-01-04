export type MediaClientFailReason =
  | 'invalidFileId'
  | 'failedAuthProvider'
  | 'clientAbortedRequest'
  | 'clientExhaustedRetries'
  | 'clientOffline'
  | 'clientTimeoutRequest'
  | 'clientFailedPolling'
  | 'serverError'
  | 'serverRateLimitedError'
  | 'serverInvalidBody'
  | 'unknown';
