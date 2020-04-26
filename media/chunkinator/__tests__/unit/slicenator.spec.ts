import { slicenator } from '../../src/slicenator';

const createFakeBlob = (size: number): { blob: Blob; sliceFn: any } => {
  const sliceFn = jest.fn() as any;
  const blob = {
    size,
    // slice: sliceFn
    slice(start, end) {
      sliceFn(start, end);
      // return start;
    },
  } as Blob;

  return { blob, sliceFn };
};

describe('Slicenator', () => {
  it('should split file into chunks', async () => {
    expect.assertions(4);
    const { blob, sliceFn } = createFakeBlob(15);

    return slicenator(blob, { size: 5 })
      .toPromise()
      .then(() => {
        expect(sliceFn.mock.calls[0]).toEqual([0, 5]);
        expect(sliceFn.mock.calls[1]).toEqual([5, 10]);
        expect(sliceFn.mock.calls[2]).toEqual([10, 15]);
        expect(sliceFn).toHaveBeenCalledTimes(3);
      });
  });

  it('should dispatch only 1 event if the chunk size if bigger than the file length', async () => {
    expect.assertions(2);
    const { blob, sliceFn } = createFakeBlob(20);
    return slicenator(blob, { size: 21 })
      .toPromise()
      .then(() => {
        expect(sliceFn.mock.calls[0]).toEqual([0, 21]);
        expect(sliceFn).toHaveBeenCalledTimes(1);
      });
  });
});
