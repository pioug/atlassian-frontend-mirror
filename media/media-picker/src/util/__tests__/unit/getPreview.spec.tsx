declare var global: any; // we need define an interface for the Node global object when overwriting global objects, in this case Image

import { getPreviewFromBlob } from '../../getPreviewFromBlob';

describe('getPreview helper method', () => {
  const img = {
    width: 5,
    height: 5,
    onload: jest.fn(),
    onerror: jest.fn(),
    src: '',
  };
  const file = new File([''], 'file.png');

  beforeEach(() => {
    const imageConstructorMock = jest.fn();

    imageConstructorMock.mockImplementation(() => img);
    global.Image = imageConstructorMock;
  });

  afterAll(() => {
    delete global.Image;
    jest.resetAllMocks();
  });

  describe('mediaType === "image"', () => {
    it('should return the img dimensions', () => {
      const promise = getPreviewFromBlob(file, 'image');

      Promise.resolve().then(() => img.onload());

      return expect(promise).resolves.toMatchObject(
        expect.objectContaining({ dimensions: { width: 5, height: 5 } }),
      );
    });

    it('should return error if image failed to load', () => {
      const promise = getPreviewFromBlob(file, 'image');
      Promise.resolve().then(() => img.onerror(new Error('some error')));

      return expect(promise).rejects.toBeInstanceOf(Error);
    });

    it('should return dimensions in addition to file', () => {
      const promise = getPreviewFromBlob(file, 'image');
      Promise.resolve().then(() => img.onload());

      return expect(promise).resolves.toMatchObject({
        file,
        dimensions: {
          width: 5,
          height: 5,
        },
      });
    });
  });

  describe('mediaType !== "image"', () => {
    it('should not return preview for non images', () => {
      const promise = getPreviewFromBlob(file, 'unknown');

      return expect(promise).resolves.toMatchObject({ file });
    });
  });
});
