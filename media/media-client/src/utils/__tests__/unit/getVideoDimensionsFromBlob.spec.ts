import VideoSnapshot from 'video-snapshot';

import {
  Dimensions,
  getVideoDimensionsFromBlob,
} from '../../getVideoDimensionsFromBlob';

describe('getVideoDimensionsFromBlob()', () => {
  const defaultMockImplementation = (
    opts: { dimensions?: Dimensions; err?: any } = {},
  ) => async () => {
    const { dimensions, err } = opts;

    if (err) {
      throw err;
    }

    return dimensions || { width: 1, height: 1 };
  };

  const setup = (opts: { dimensions?: Dimensions; err?: any } = {}) => {
    const snapshoterMock = new VideoSnapshot(new Blob());

    snapshoterMock.getDimensions = jest
      .fn<Promise<Dimensions>, any[]>()
      .mockImplementation(defaultMockImplementation(opts));
    snapshoterMock.end = jest.fn();

    return { snapshoterMock };
  };

  it('should resolve video dimensions', async () => {
    const { snapshoterMock } = setup({
      dimensions: { width: 100, height: 100 },
    });

    expect.assertions(2);
    const dimensions = await getVideoDimensionsFromBlob(
      new Blob(),
      snapshoterMock,
    );
    expect(dimensions).toMatchObject({ width: 100, height: 100 });
    expect(snapshoterMock.end).toHaveBeenCalledTimes(1);
  });

  it('gracefully handle error from VideoSnapshot', async () => {
    const { snapshoterMock } = setup({ err: new Error('unknown error') });

    expect.assertions(3);
    try {
      await getVideoDimensionsFromBlob(new Blob(), snapshoterMock);
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e.message).toEqual('unknown error');
      expect(snapshoterMock.end).toHaveBeenCalledTimes(1);
    }
  });
});
