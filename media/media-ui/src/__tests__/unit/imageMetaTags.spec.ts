const mockXMPMetaData = {};
const mockReadJPEGExifMetaData = jest.fn().mockReturnValue('jpgMetaData');
const mockReadPNGXMPMetaData = jest.fn().mockReturnValue('pngMetaData');
const mockParseXMPMetaData = jest.fn().mockReturnValue(mockXMPMetaData);

jest.mock('../../imageMetaData/parseJPEG', () => ({
  readJPEGExifMetaData: mockReadJPEGExifMetaData,
}));
jest.mock('../../imageMetaData/parsePNG', () => ({
  readPNGXMPMetaData: mockReadPNGXMPMetaData,
}));
jest.mock('../../imageMetaData/parsePNGXMP', () => ({
  parseXMPMetaData: mockParseXMPMetaData,
}));

import { readImageMetaTags } from '../../imageMetaData/metatags';

describe('Image Meta Tags', () => {
  const pngFile = new File([], 'filename.png', { type: 'image/png' });
  const jpegFile = new File([], 'filename.jpeg', { type: 'image/jpeg' });

  describe('readImageMetaTags()', () => {
    it('should use PNG parser on PNG file', async () => {
      const metaData = await readImageMetaTags(pngFile);
      expect(mockReadPNGXMPMetaData).toBeCalledWith(pngFile);
      expect(mockParseXMPMetaData).toBeCalled();
      expect(metaData).toEqual(mockXMPMetaData);
    });

    it('should use JPEG parser on JPEG file', async () => {
      const metaData = await readImageMetaTags(jpegFile);
      expect(mockReadJPEGExifMetaData).toBeCalledWith(jpegFile);
      expect(metaData).toEqual('jpgMetaData');
    });

    it('should return null if JPEG parsing causes error', async () => {
      mockReadJPEGExifMetaData.mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(jpegFile);
      expect(metaData).toBeNull();
    });

    it('should return null if PNG parsing causes error', async () => {
      mockReadPNGXMPMetaData.mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(pngFile);
      expect(metaData).toBeNull();
    });
  });
});
