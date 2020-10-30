jest.mock('../../imageMetaData/parseJPEG', () => ({
  readJPEGExifMetaData: jest.fn(() => 'jpgMetaData'),
}));
jest.mock('../../imageMetaData/parsePNG', () => ({
  readPNGXMPMetaData: jest.fn(() => 'pngMetaData'),
}));
jest.mock('../../imageMetaData/parsePNGXMP', () => ({
  parseXMPMetaData: jest.fn(() => ({})),
}));

import { readJPEGExifMetaData } from '../../imageMetaData/parseJPEG';
import { readPNGXMPMetaData } from '../../imageMetaData/parsePNG';
import { parseXMPMetaData } from '../../imageMetaData/parsePNGXMP';

import { readImageMetaTags } from '../../imageMetaData/metatags';

describe('Image Meta Tags', () => {
  const pngFile = new File([], 'filename.png', { type: 'image/png' });
  const jpegFile = new File([], 'filename.jpeg', { type: 'image/jpeg' });

  describe('readImageMetaTags()', () => {
    it('should use PNG parser on PNG file', async () => {
      const metaData = await readImageMetaTags(pngFile);
      expect(readPNGXMPMetaData).toBeCalledWith(pngFile);
      expect(parseXMPMetaData).toBeCalled();
      expect(metaData).toEqual({});
    });

    it('should use JPEG parser on JPEG file', async () => {
      const metaData = await readImageMetaTags(jpegFile);
      expect(readJPEGExifMetaData).toBeCalledWith(jpegFile);
      expect(metaData).toEqual('jpgMetaData');
    });

    it('should return null if JPEG parsing causes error', async () => {
      (readJPEGExifMetaData as jest.Mock).mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(jpegFile);
      expect(metaData).toBeNull();
    });

    it('should return null if PNG parsing causes error', async () => {
      (readPNGXMPMetaData as jest.Mock).mockImplementation(() => {
        throw new Error('Boom!');
      });
      const metaData = await readImageMetaTags(pngFile);
      expect(metaData).toBeNull();
    });
  });
});
