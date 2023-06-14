import { processError } from '../../../../../viewers/doc/processError';
import { MediaViewerError } from '../../../../../errors';
import { RequestError } from '@atlaskit/media-client';

class ErrorWithStatus extends Error {
  status: number | undefined;
}

describe('processError', () => {
  it('returns a Media Viewer error containing a Request error if the input contains a status code', () => {
    const someError = new ErrorWithStatus();
    someError.status = 333;
    const result = processError(someError);
    expect(result).toBeInstanceOf(MediaViewerError);
    expect(result.secondaryError).toBeInstanceOf(RequestError);
  });

  it('returns a Media Viewer error containing the input if the it does not contain a status code', () => {
    const someError = new Error();
    const result = processError(someError);
    expect(result).toBeInstanceOf(MediaViewerError);
    expect(result.secondaryError).toBe(someError);
  });
});
