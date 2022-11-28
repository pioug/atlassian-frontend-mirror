const mockMediaEnvironment = 'test-local';
const mockMediaRegion = 'test-local-region';

jest.mock('@atlaskit/ufo', () => {
  const actualUfo = jest.requireActual('@atlaskit/ufo');
  return {
    ...actualUfo,
    ConcurrentExperience: jest.fn(),
  };
});

jest.mock('@atlaskit/media-client', () => {
  const mediaClient = jest.requireActual('@atlaskit/media-client');
  return {
    ...mediaClient,
    getMediaEnvironment: () => mockMediaEnvironment,
    getMediaRegion: () => mockMediaRegion,
  };
});

jest.mock('../../../utils/analytics', () => {
  const actualAnalytics = jest.requireActual('../../../utils/analytics');
  return {
    ...actualAnalytics,
    getRenderErrorRequestMetadata: jest
      .fn()
      .mockImplementation(() => undefined),
    extractErrorInfo: jest.fn().mockImplementation(() => {
      return {
        failReason: 'some-reason',
        error: 'some-error',
        errorDetail: 'some-description',
      };
    }),
    LOGGED_FEATURE_FLAG_KEYS: ['feature-flag-1', 'feature-flag-2'],
  };
});

import { ConcurrentExperience } from '@atlaskit/ufo';

import {
  startUfoExperience,
  completeUfoExperience,
} from '../../../utils/ufoExperiences';
import { extractErrorInfo } from '../../../utils/analytics';
import { MediaCardError } from '../../../errors';
import { SSRStatus } from '../../../utils/analytics';

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

  const mockConcurrentExperienceConstructor = jest.fn(() => {
    return {
      getInstance: mockGetInstance,
    } as any;
  });

  (
    ConcurrentExperience as jest.MockedClass<typeof ConcurrentExperience>
  ).mockImplementation(mockConcurrentExperienceConstructor);

  const ssrReliability: SSRStatus = {
    server: {
      status: 'success',
    },
    client: {
      status: 'success',
    },
  };
  const fileAttributes = {
    fileId: 'some-id',
    fileMediatype: undefined,
    fileMimetype: undefined,
  };
  const id = 'some-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('startUfoExperience', () => {
    it('should start UFO experience with an id', () => {
      startUfoExperience(id);

      expect(mockGetInstance).toBeCalledTimes(1);
      expect(mockGetInstance).toBeCalledWith('some-id');
      expect(mockStart).toHaveBeenCalledTimes(1);
      expect(mockConcurrentExperienceConstructor).toBeCalledWith(
        'media-card-render',
        {
          featureFlags: ['feature-flag-1', 'feature-flag-2'],
          platform: { component: 'media-card' },
          type: 'experience',
          performanceType: 'inline-result',
        },
      );
    });

    describe('completeUfoExperience', () => {
      it('should succeed an experience when the status is complete', () => {
        completeUfoExperience(
          id,
          'complete',
          fileAttributes,
          { wasStatusUploading: true, wasStatusProcessing: true },
          ssrReliability,
          undefined,
        );

        expect(mockSuccess).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            fileStateFlags: {
              wasStatusProcessing: true,
              wasStatusUploading: true,
            },
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            mediaEnvironment: mockMediaEnvironment,
            mediaRegion: mockMediaRegion,
          },
        });
      });

      it('should fail an experience when the status is failed-processing', () => {
        completeUfoExperience(
          id,
          'failed-processing',
          fileAttributes,
          { wasStatusUploading: false, wasStatusProcessing: false },
          ssrReliability,
          undefined,
        );

        expect(mockFailure).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            fileStateFlags: {
              wasStatusProcessing: false,
              wasStatusUploading: false,
            },
            failReason: 'failed-processing',
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            mediaEnvironment: mockMediaEnvironment,
            mediaRegion: mockMediaRegion,
          },
        });
      });

      it('should fail an experience with a default error if the status is error but no error is provided', () => {
        completeUfoExperience(
          id,
          'error',
          fileAttributes,
          { wasStatusUploading: false, wasStatusProcessing: false },
          ssrReliability,
        );

        expect(extractErrorInfo).toBeCalledWith(expect.any(Error));
        expect(mockFailure).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            fileStateFlags: {
              wasStatusProcessing: false,
              wasStatusUploading: false,
            },
            request: undefined,
            failReason: 'some-reason',
            error: 'some-error',
            errorDetail: 'some-description',
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            mediaEnvironment: mockMediaEnvironment,
            mediaRegion: mockMediaRegion,
          },
        });
      });

      it('should fail an experience with provided error data if the status is error', () => {
        const error = new MediaCardError('upload');
        completeUfoExperience(
          id,
          'error',
          fileAttributes,
          { wasStatusUploading: false, wasStatusProcessing: false },
          ssrReliability,
          error,
        );

        expect(extractErrorInfo).toBeCalledWith(error);
        expect(mockFailure).toBeCalledWith({
          metadata: {
            fileAttributes,
            ssrReliability,
            fileStateFlags: {
              wasStatusProcessing: false,
              wasStatusUploading: false,
            },
            request: undefined,
            failReason: 'some-reason',
            error: 'some-error',
            errorDetail: 'some-description',
            packageName: expect.any(String),
            packageVersion: expect.any(String),
            mediaEnvironment: mockMediaEnvironment,
            mediaRegion: mockMediaRegion,
          },
        });
      });
    });
  });
});
