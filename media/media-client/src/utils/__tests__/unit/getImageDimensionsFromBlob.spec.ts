import {
  Dimensions,
  getImageDimensionsFromBlob,
} from '../../getImageDimensionsFromBlob';

describe('getImageDimensionsFromBlob()', () => {
  interface Image {
    width: number;
    height: number;
    onload?: () => void;
    onerror?: (err: any) => void;
  }

  const mockedImageFactory = (
    opts: { dimensions?: Dimensions; err?: any } = {},
  ) => {
    const { dimensions, err } = opts;

    return function mockedImage(this: Image) {
      this.width = dimensions?.width || 0;
      this.height = dimensions?.height || 0;

      setTimeout(() => {
        if (!!err && this.onerror) {
          this.onerror(err);
        } else if (this.onload) {
          this.onload();
        }
      }, 0);
    };
  };

  const setup = (opts: { dimensions?: Dimensions; err?: any } = {}) => {
    (global as any).Image = mockedImageFactory(opts);
  };

  it('should resolve image dimensions', async () => {
    setup({ dimensions: { width: 100, height: 100 } });

    const dimensions = await getImageDimensionsFromBlob('');
    expect(dimensions).toMatchObject({ width: 100, height: 100 });
  });

  it('gracefully handle Image error', async () => {
    const unknownError = new Error('unknown error');
    setup({ err: unknownError });

    expect.assertions(1);
    try {
      await getImageDimensionsFromBlob('');
    } catch (err) {
      expect(err).toEqual(unknownError);
    }
  });
});
