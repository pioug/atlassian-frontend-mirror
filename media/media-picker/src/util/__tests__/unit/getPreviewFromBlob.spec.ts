import { Dimensions, getDimensionsFromBlob } from '@atlaskit/media-client';
import { asMockFunction } from '@atlaskit/media-test-helpers';

import { getPreviewFromBlob } from '../../getPreviewFromBlob';

jest.mock('@atlaskit/media-client', () => {
  const actualModule = jest.requireActual('@atlaskit/media-client');

  return {
    ...actualModule,
    getDimensionsFromBlob: jest.fn(),
  };
});

describe('getPreviewFromBlob()', () => {
  const setup = (opts: { dimensions?: Dimensions; err?: any }) => {
    const { dimensions, err } = opts;

    asMockFunction(getDimensionsFromBlob).mockImplementation(async () => {
      if (err) {
        throw err;
      }

      return dimensions || { width: 1, height: 1 };
    });

    return {
      file: new File([''], 'file.png'),
    };
  };

  afterEach(() => jest.resetAllMocks());

  describe('mediaType === "image"', () => {
    it('should resolve dimensions in addition to file', async () => {
      const { file } = setup({ dimensions: { width: 5, height: 5 } });

      const preview = await getPreviewFromBlob('image', file);
      expect(preview).toMatchObject({
        file,
        dimensions: {
          width: 5,
          height: 5,
        },
        scaleFactor: 1,
      });
    });

    it('should reject with an error if getDimensionsFromBlob throws', async () => {
      const { file } = setup({ err: new Error('some error') });

      expect.assertions(2);
      try {
        await getPreviewFromBlob('image', file);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('some error');
      }
    });
  });

  describe('mediaType === "video"', () => {
    it('should not return dimensions if they are empty', async () => {
      const { file } = setup({ dimensions: { width: 0, height: 0 } });

      const preview = await getPreviewFromBlob('video', file);
      expect(preview).toMatchObject({
        file,
        scaleFactor: 1,
      });
    });
  });

  describe('mediaType !== "image" and mediaType !== "video"', () => {
    it('should not return dimensions for types other than images/videos', async () => {
      const { file } = setup({ dimensions: { width: 5, height: 5 } });

      const preview = await getPreviewFromBlob('doc', file);
      expect(preview).toMatchObject({
        file,
      });
    });
  });
});
