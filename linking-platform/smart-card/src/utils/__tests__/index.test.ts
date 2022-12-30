import { importWithRetry } from '../index';
import * as utils from '../index';

export class ChunkLoadError extends Error {
  name = 'ChunkLoadError';

  constructor(chunkId: string = 'test-chunk') {
    super();
    this.message = `Loading chunk ${chunkId} failed`;
  }
}

describe('importWithRetry', () => {
  // Jest has trouble handling async timeouts with fake timers
  jest.spyOn(utils, 'sleep').mockImplementation(() => Promise.resolve());

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not retry if promise resolves', async () => {
    const importFunction = jest.fn();
    importFunction.mockImplementation(() =>
      Promise.resolve('it is your birthday.'),
    );

    const result = await importWithRetry(importFunction);

    expect(importFunction).toHaveBeenCalledTimes(1);
    expect(result).toBe('it is your birthday.');
  });

  it('should not retry if promise rejects and retries is 0', async () => {
    const importFunction = jest.fn();
    importFunction.mockImplementation(() =>
      Promise.reject(new ChunkLoadError()),
    );

    await expect(importWithRetry(importFunction, 0)).rejects.toThrow(
      new ChunkLoadError(),
    );
    expect(importFunction).toHaveBeenCalledTimes(1);
  });

  it('should not retry if the promise rejects for something other than a ChunkLoadError', async () => {
    const importFunction = jest.fn();
    importFunction.mockImplementationOnce(() => {
      throw new Error('random error');
    });

    await expect(importWithRetry(importFunction)).rejects.toThrow(
      new Error('random error'),
    );
    expect(importFunction).toHaveBeenCalledTimes(1);
  });

  it('should retry if promise rejects and reject with the most recent error', async () => {
    const importFunction = jest.fn();
    importFunction
      .mockImplementationOnce(() =>
        Promise.reject(new ChunkLoadError('fail-chunk-1')),
      )
      .mockImplementationOnce(() =>
        Promise.reject(new ChunkLoadError('fail-chunk-2')),
      )
      .mockImplementationOnce(() =>
        Promise.reject(new ChunkLoadError('fail-chunk-3')),
      );

    await expect(importWithRetry(importFunction)).rejects.toThrow(
      new ChunkLoadError('fail-chunk-3'),
    );

    expect(importFunction).toHaveBeenCalledTimes(3);
  });
});
