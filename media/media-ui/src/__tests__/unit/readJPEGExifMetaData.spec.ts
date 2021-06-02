const mockParseMetaData = jest.fn((_file: any, fn: any) => {
  fn({
    exif: {
      getAll: () => ({
        Orientation: 1,
        XResolution: {
          numerator: 2,
          denominator: 3,
        },
        YResolution: {
          numerator: 4,
          denominator: 5,
        },
        ResolutionUnit: 6,
        Software: 'Pixelmator 3.7.4',
        DateTime: '2018:09:18 13:09:09',
        ExifIFDPointer: 7,
        ColorSpace: 8,
        PixelXDimension: 9,
        PixelYDimension: 10,
        thumbnail: {},
      }),
    },
  });
});

jest.mock('blueimp-load-image', () => ({
  parseMetaData: mockParseMetaData,
}));

import { readJPEGExifMetaData } from '../../imageMetaData/parseJPEG';

describe('Image Meta Data JPEG parsing', () => {
  describe('readJPEGExifMetaData()', () => {
    const jpegFile = new File([], 'filename.jpeg', { type: 'image/jpeg' });

    it('should convert numeric values to string', async () => {
      const tags = await readJPEGExifMetaData(jpegFile);
      Object.keys(tags).forEach((key) =>
        expect(typeof tags[key]).not.toBe('number'),
      );
    });

    it('should convert numerator/denominator values to single numerator', async () => {
      const tags = await readJPEGExifMetaData(jpegFile);
      expect(tags.XResolution).toBe('2');
      expect(tags.YResolution).toBe('4');
    });
  });
});
