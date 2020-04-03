jest.mock('../../imageMetaData/metatags');
jest.mock('../../imageMetaData/imageOrientationUtil');

import { asMock } from '@atlaskit/media-test-helpers';
import * as util from '../../util';

import {
  getImageInfo,
  getOrientation,
  getMetaTagNumericValue,
  getScaleFactorFromFile,
  readImageMetaData,
  ImageMetaData,
  ImageMetaDataTags,
  ImageInfo,
} from '../../imageMetaData';
import { isRotated } from '../../imageMetaData/imageOrientationUtil';
import { readImageMetaTags } from '../../imageMetaData/metatags';
import { ExifOrientation } from '../../imageMetaData/types';

describe('Image Meta Data', () => {
  let loadImage: jest.Mock<any>;
  const fileInfo = {
    file: new File([], 'some-file', { type: 'image/png' }),
    src: 'some-src',
  };

  beforeEach(() => {
    // @ts-ignore This violated type definition upgrade of @types/jest to v24.0.18 & ts-jest v24.1.0.
    //See BUILDTOOLS-210-clean: https://bitbucket.org/atlassian/atlaskit-mk-2/pull-requests/7178/buildtools-210-clean/diff
    loadImage = jest.spyOn(util, 'loadImage').mockReturnValue(({
      naturalWidth: 1,
      naturalHeight: 2,
    } as unknown) as Promise<HTMLImageElement>);
    asMock(readImageMetaTags).mockReturnValue({ Orientation: 'top-right' });
  });

  describe('getImageInfo()', () => {
    it('should return image info from valid file', async () => {
      const imageInfo = await getImageInfo(fileInfo);
      expect(imageInfo).toEqual(
        expect.objectContaining({
          scaleFactor: 1,
          width: 1,
          height: 2,
        }),
      );
    });

    it('should use scaleFactor from filename', async () => {
      const imageInfo = (await getImageInfo({
        file: new File([], 'some-file@2x.png', { type: 'image/png' }),
        src: 'some-src',
      })) as ImageInfo;
      expect(imageInfo.scaleFactor).toBe(2);
    });

    it('should return null when images fail to load', async () => {
      loadImage.mockImplementation(() => {
        throw new Error();
      });
      const imageInfo = await getImageInfo(fileInfo);
      expect(imageInfo).toBeNull();
    });
  });

  describe('getOrientation()', () => {
    const file = new File([], 'some-filename');

    it('should return orientation from metatags using strings', async () => {
      const orientation = await getOrientation(file);
      expect(readImageMetaTags).toBeCalled();
      expect(orientation).toBe(ExifOrientation['top-right']);
    });

    it('should return orientation from metatags using numbers', async () => {
      asMock(readImageMetaTags).mockReturnValue({ Orientation: '6' });
      const orientation = await getOrientation(file);
      expect(orientation).toBe(6);
    });

    it('should return 1="top-left" (default) when cannot read orientation from metatags', async () => {
      asMock(readImageMetaTags).mockReturnValue({});
      const orientation = await getOrientation(file);
      expect(readImageMetaTags).toBeCalled();
      expect(orientation).toBe(ExifOrientation['top-left']);
    });
  });

  describe('getMetaTagNumericValue()', () => {
    it('should parse numeric values from metatags', () => {
      expect(getMetaTagNumericValue({ A: '2' }, 'A', 1)).toBe(2);
    });

    it('should return default value when not found in metatags', () => {
      expect(getMetaTagNumericValue({}, 'A', 1)).toBe(1);
    });

    it('should return default value cannot parse metatags', () => {
      expect(getMetaTagNumericValue({ A: 'xyz' }, 'A', 1)).toBe(1);
    });
  });

  describe('getScaleFactorFromFile()', () => {
    it('should detect scaleFactor from filename with correct pattern', () => {
      const file = new File([], 'filename@2x.png');
      expect(getScaleFactorFromFile(file)).toBe(2);
    });

    it('should not detect scaleFactor from filename with incorrect pattern', () => {
      const file = new File([], 'filename@x2.png');
      expect(getScaleFactorFromFile(file)).toBe(null);
    });

    it('should find floating values from one decimal', () => {
      const file = new File([], 'filename@2.3x.png');
      expect(getScaleFactorFromFile(file)).toBe(2.3);
    });

    it('should find reasonable floating values from multiple decimals', () => {
      const file = new File([], 'filename@2.3.4x.png');
      expect(getScaleFactorFromFile(file)).toBe(2.3);
    });
  });

  describe('readImageMetaData()', () => {
    it('should read image metadata properties from file info', async () => {
      loadImage.mockReturnValue({
        naturalWidth: 1,
        naturalHeight: 2,
      });
      asMock(readImageMetaTags).mockReturnValue({ Orientation: 'top-left' });
      const imageMetaData = (await readImageMetaData(
        fileInfo,
      )) as ImageMetaData;
      expect(imageMetaData.type).toBe('image/png');
      expect(imageMetaData.width).toBe(1);
      expect(imageMetaData.height).toBe(2);
      expect((imageMetaData.tags as ImageMetaDataTags).Orientation).toBe(
        'top-left',
      );
    });

    it("should flip width and height when image is on it's side", async () => {
      loadImage.mockReturnValue({
        naturalWidth: 100,
        naturalHeight: 75,
      });
      asMock(isRotated).mockReturnValue(true);
      const imageMetaData = (await readImageMetaData(
        fileInfo,
      )) as ImageMetaData;
      expect(imageMetaData.width).toBe(75);
      expect(imageMetaData.height).toBe(100);
    });

    it('should return null when images fail to load', async () => {
      loadImage.mockImplementation(() => {
        throw new Error();
      });
      const imageMetaData = await readImageMetaData(fileInfo);
      expect(imageMetaData).toBeNull();
    });
  });
});
