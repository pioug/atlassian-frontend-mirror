import { getMediaClientFailReason } from '../../getMediaClientFailReason';
import { MediaClientFailReason } from '../../../models/analytics';
import { FileFetcherError, MediaStoreError } from '../../../models/errors';
import { RequestError } from '../../request/errors';
import { PollingError } from '../../polling/errors';

describe('getMediaClientFailReason()', () => {
  const fileId = 'file-id';

  const expectedResults: Array<[Error, MediaClientFailReason]> = [
    [new FileFetcherError('invalidFileId', fileId), 'invalidFileId'],
    [new MediaStoreError('failedAuthProvider'), 'failedAuthProvider'],
    [
      new RequestError('serverError', {
        statusCode: 429,
      }),
      'serverRateLimitedError',
    ],
    [new RequestError('clientAbortedRequest'), 'clientAbortedRequest'],
    [new RequestError('clientExhaustedRetries'), 'clientExhaustedRetries'],
    [new RequestError('clientOffline'), 'clientOffline'],
    [new RequestError('clientTimeoutRequest'), 'clientTimeoutRequest'],
    [
      new RequestError('serverError', {
        statusCode: 500,
      }),
      'serverError',
    ],
    [new RequestError('serverInvalidBody'), 'serverInvalidBody'],
    [new PollingError('maxAttemptsExceeded', 5), 'clientFailedPolling'],
    [new PollingError('maxFailuresExceeded', 10), 'clientFailedPolling'],
  ];

  it.each(
    expectedResults,
  )(
    'given %s, it should return corresponding MediaClientFailReason',
    (error, reason) => expect(getMediaClientFailReason(error)).toEqual(reason),
  );

  it('should return MediaClientFailReason.UNKNOWN otherwise', () =>
    expect(getMediaClientFailReason(new Error())).toEqual('unknown'));
});
