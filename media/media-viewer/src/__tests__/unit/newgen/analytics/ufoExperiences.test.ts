jest.mock('@atlaskit/ufo', () => {
  const actualUfo = jest.requireActual('@atlaskit/ufo');
  return {
    ...actualUfo,
    UFOExperience: jest.fn().mockReturnValue({
      start: jest.fn(),
      addMetadata: jest.fn(),
      success: jest.fn(),
      failure: jest.fn(),
    }),
  };
});
jest.mock('../../../../version.json', () => ({
  name: 'test package',
  version: '1.0',
}));

import {
  UFOExperience,
  ExperiencePerformanceTypes,
  ExperienceTypes,
} from '@atlaskit/ufo';

import {
  startMediaFileUfoExperience,
  succeedMediaFileUfoExperience,
  failMediaFileUfoExperience,
} from '../../../../analytics/ufoExperiences';

const mocks = (UFOExperience as jest.Mock)();

describe('ufoExperience', () => {
  const fileAttributes = {
    fileId: 'some-id',
    fileMediatype: undefined,
    fileMimetype: undefined,
  };
  const packageInfo = {
    packageName: 'test package',
    packageVersion: '1.0',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startUfoExperience', () => {
    it('should start UFO experience', () => {
      startMediaFileUfoExperience();

      const inlineExperience = {
        platform: { component: 'media-viewer' },
        type: ExperienceTypes.Experience,
        performanceType: ExperiencePerformanceTypes.InlineResult,
      };
      expect(UFOExperience).toHaveBeenCalledTimes(1);
      expect(UFOExperience).toHaveBeenCalledWith(
        'media-file',
        inlineExperience,
      );
      expect(mocks.start).toHaveBeenCalledTimes(1);
    });

    describe('succeedMediaFileUfoExperience', () => {
      it('should be able to succeed an experience with provided metadata', () => {
        succeedMediaFileUfoExperience(fileAttributes);

        expect(mocks.success).toBeCalledWith({
          metadata: {
            fileAttributes: fileAttributes,
            ...packageInfo,
          },
        });
      });

      it('should be able to succeed an experience without provided metadata', () => {
        succeedMediaFileUfoExperience();

        expect(mocks.success).toBeCalledWith({
          metadata: {
            ...packageInfo,
          },
        });
      });
    });

    describe('failMediaFileUfoExperience', () => {
      it('should be able to fail an experience with provided metadata', () => {
        failMediaFileUfoExperience({
          failReason: 'imageviewer-external-onerror',
          errorDetail: undefined,
          fileAttributes: fileAttributes,
        });

        expect(mocks.failure).toBeCalledWith({
          metadata: {
            failReason: 'imageviewer-external-onerror',
            errorDetail: undefined,
            fileAttributes: fileAttributes,
            ...packageInfo,
          },
        });
      });

      it('should be able to fail an experience without provided metadata', () => {
        failMediaFileUfoExperience();

        expect(mocks.failure).toBeCalledWith({
          metadata: {
            ...packageInfo,
          },
        });
      });
    });
  });
});
