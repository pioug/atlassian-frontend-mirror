import { MediaCardErrorInfo, SSRStatus } from '../../utils/analytics';

jest.mock('@atlaskit/ufo', () => {
  const actualUfo = jest.requireActual('@atlaskit/ufo');
  return {
    ...actualUfo,
    ConcurrentExperience: jest.fn(),
  };
});
jest.mock('../../utils/analytics', () => {
  const actualAnalytics = jest.requireActual('../../utils/analytics');
  return {
    ...actualAnalytics,
    getRenderErrorRequestMetadata: jest
      .fn()
      .mockImplementation(() => undefined),
    extractErrorInfo: jest.fn().mockImplementation(() => {
      return {
        failReason: 'nativeError',
        error: 'nativeError',
        errorDetail: 'description of the error',
      };
    }),
  };
});
jest.mock('../../version.json', () => ({
  name: 'test package',
  version: '1.0',
}));

import { ConcurrentExperience } from '@atlaskit/ufo';

import {
  startUfoExperience,
  completeUfoExperience,
} from '../../utils/ufoExperiences';
import { MediaCardError } from '../../errors';

describe('ufoExperience', () => {
  const mockStart: jest.Mock = jest.fn();
  const mockAddMetadata: jest.Mock = jest.fn();
  const mockSuccess: jest.Mock = jest.fn();
  const mockFailure: jest.Mock = jest.fn();

  const mockGetInstance = jest.fn().mockImplementation(() => {
    return {
      start: mockStart,
      success: mockSuccess,
      failure: mockFailure,
      addMetadata: mockAddMetadata,
    } as any;
  });

  (ConcurrentExperience as jest.MockedClass<
    typeof ConcurrentExperience
  >).mockImplementation(() => {
    return {
      getInstance: mockGetInstance,
    } as any;
  });

  const ssrReliability: SSRStatus = {
    server: {
      status: 'success',
    },
    client: {
      status: 'success',
    },
  };
  const packageInfo = {
    packageName: 'test package',
    packageVersion: '1.0',
  };
  const fileAttributes = {
    fileId: 'some-id',
    fileMediatype: undefined,
    fileMimetype: undefined,
  };
  const id = 'some-id';
  const mediaCardErrorInfo: MediaCardErrorInfo = {
    failReason: 'nativeError',
    error: 'nativeError',
    errorDetail: 'description of the error',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startUfoExperience', () => {
    it('should start UFO experience with an id', () => {
      startUfoExperience(id);

      expect(mockGetInstance).toBeCalledTimes(1);
      expect(mockGetInstance).toBeCalledWith('some-id');
      expect(mockStart).toHaveBeenCalledTimes(1);
    });

    describe('completeUfoExperience', () => {
      it('should succeed an experience when the status is complete', () => {
        completeUfoExperience(
          id,
          'complete',
          fileAttributes,
          ssrReliability,
          undefined,
        );

        expect(mockSuccess).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            ...packageInfo,
          },
        });
      });

      it('should fail an experience when the status is failed-processing', () => {
        completeUfoExperience(
          id,
          'failed-processing',
          fileAttributes,
          ssrReliability,
          undefined,
        );

        expect(mockFailure).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            failReason: 'failed-processing',
            ...packageInfo,
          },
        });
      });

      it('should not fail an experience if the status is error but no error is provided', () => {
        completeUfoExperience(
          id,
          'error',
          fileAttributes,
          ssrReliability,
          undefined,
        );

        expect(mockFailure).toBeCalledTimes(0);
      });

      it('should fail an experience with provided error data if the status is error', () => {
        completeUfoExperience(
          id,
          'error',
          fileAttributes,
          ssrReliability,
          new MediaCardError('upload'),
        );

        expect(mockFailure).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            request: undefined,
            ...mediaCardErrorInfo,
            ...packageInfo,
          },
        });
      });
    });
  });
});
