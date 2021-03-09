import {
  BaseMediaClientError,
  getMediaClientErrorReason,
  isMediaClientError,
} from '../../errors';

import { MediaClientErrorAttributes } from '../../errors/types';

class TestError extends BaseMediaClientError<
  MediaClientErrorAttributes & {
    some: string;
    data: string;
  }
> {
  constructor(private some: string, private data: string) {
    super('TestError');
  }
  get attributes() {
    return {
      reason: 'serverUnexpectedError' as const,
      some: this.some,
      data: this.data,
    };
  }
}

describe('MediaClientError', () => {
  it('should be identifiable', () => {
    const nonObject = 'I am a string';
    expect(isMediaClientError(nonObject)).toBeFalsy();

    const trickyObject = { attributes: 'I am a string' };
    expect(isMediaClientError(trickyObject)).toBeFalsy();

    const fakeError = {
      attributes: { reason: 'I am not a MediaClientErrorReason' },
    };
    expect(isMediaClientError(fakeError)).toBeFalsy();

    const fakeError2 = {
      attributes: { reason: 'serverUnexpectedError' },
    };
    expect(isMediaClientError(fakeError2)).toBeFalsy();

    const unknownError = new Error('unknown error');
    expect(isMediaClientError(unknownError)).toBeFalsy();

    const testError = new TestError('some', 'data');
    expect(isMediaClientError(testError)).toBeTruthy();
  });

  describe('BaseMediaClientError', () => {
    it('should be extensible', () => {
      const testError = new TestError('some', 'data');
      expect(typeof Object.getPrototypeOf(testError).attributes).toBeTruthy();
    });
  });

  describe('getMediaClientErrorReason()', () => {
    it('should return reason if error is MediaClientError type', () => {
      const testError = new TestError('some', 'data');
      expect(getMediaClientErrorReason(testError)).toEqual(
        'serverUnexpectedError',
      );
    });

    it('should return unknown otherwise', () =>
      expect(getMediaClientErrorReason(new Error())).toEqual('unknown'));
  });
});
