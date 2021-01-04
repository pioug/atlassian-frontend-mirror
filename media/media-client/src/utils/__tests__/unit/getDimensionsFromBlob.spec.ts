import { asMockFunction } from '@atlaskit/media-test-helpers';

import { getDimensionsFromBlob, Dimensions } from '../../getDimensionsFromBlob';
import { getImageDimensionsFromBlob } from '../../getImageDimensionsFromBlob';
import { getVideoDimensionsFromBlob } from '../../getVideoDimensionsFromBlob';

jest.mock('../../getImageDimensionsFromBlob');
jest.mock('../../getVideoDimensionsFromBlob');

describe('getDimensionsFromBlob()', () => {
  const defaultMockImplementation = (
    opts: { dimensions?: Dimensions; err?: any } = {},
  ) => async () => {
    const { dimensions, err } = opts;

    if (err) {
      throw err;
    }

    return dimensions || { width: 1, height: 1 };
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setup = (opts: { dimensions?: Dimensions; err?: any } = {}) => {
    asMockFunction(getImageDimensionsFromBlob).mockImplementation(
      defaultMockImplementation(opts),
    );

    asMockFunction(getVideoDimensionsFromBlob).mockImplementation(
      defaultMockImplementation(opts),
    );

    return {
      createObjectURLSpy: jest.spyOn(URL, 'createObjectURL'),
      revokeObjectURLSpy: jest.spyOn(URL, 'revokeObjectURL'),
    };
  };

  describe('Image:', () => {
    it('should create an object URL, call getImageDimensions() and revoke it', async () => {
      const { createObjectURLSpy, revokeObjectURLSpy } = setup({
        dimensions: { width: 100, height: 100 },
      });

      const dimensions = await getDimensionsFromBlob('image', new Blob());
      expect(dimensions).toEqual({ width: 100, height: 100 });

      expect(getImageDimensionsFromBlob).toHaveBeenCalledTimes(1);
      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
    });

    it('with an error, should create and revoke object URL', async () => {
      const err = new Error('unknown error');
      const { createObjectURLSpy, revokeObjectURLSpy } = setup({ err });

      expect.assertions(5);
      try {
        await getDimensionsFromBlob('image', new Blob());
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('unknown error');
        expect(getImageDimensionsFromBlob).toHaveBeenCalledTimes(1);
        expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
        expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('Video:', () => {
    it('should call getVideoDimensions()', async () => {
      setup({
        dimensions: { width: 100, height: 100 },
      });

      const dimensions = await getDimensionsFromBlob('video', new Blob());
      expect(dimensions).toEqual({ width: 100, height: 100 });

      expect(getVideoDimensionsFromBlob).toHaveBeenCalledTimes(1);
    });
  });
});
