import { Options } from '../../src/domain';

import { chunkinator } from '../../src/chunkinator';

describe('chunkinator', () => {
  let file: Blob;
  let options: Options;
  let hashingFunction: jest.Mock;
  let probingFunction: jest.Mock;
  let uploadingFunction: jest.Mock;
  let processingFunction: jest.Mock;
  let onProgress: jest.Mock<(progress: number) => void>;

  beforeEach(() => {
    onProgress = jest.fn();

    file = new Blob(['123456789012345'], { type: 'plain/text' });
    hashingFunction = jest.fn();
    hashingFunction.mockName('hashingFunction');
    hashingFunction.mockReturnValue(Promise.resolve('random-hash'));

    probingFunction = jest.fn();
    probingFunction.mockName('probingFunction');
    probingFunction.mockReturnValue(Promise.resolve([false]));

    uploadingFunction = jest.fn();
    uploadingFunction.mockName('uploadingFunction');
    uploadingFunction.mockReturnValue(Promise.resolve());

    processingFunction = jest.fn();
    processingFunction.mockName('processingFunction');
    processingFunction.mockReturnValue(Promise.resolve());

    options = {
      chunkSize: 5,
      hashingConcurrency: 1,
      hashingFunction,
      probingBatchSize: 1,
      probingFunction,
      uploadingConcurrency: 1,
      uploadingFunction,
      processingBatchSize: 2,
      processingFunction,
    };
  });

  it('should resolve when the upload is done', async () => {
    const observable = chunkinator(file, options, { onProgress });
    await observable.toPromise();
    expect(hashingFunction).toHaveBeenCalledTimes(3);
    expect(probingFunction).toHaveBeenCalledTimes(3);
    expect(uploadingFunction).toHaveBeenCalledTimes(3);
    expect(processingFunction).toHaveBeenCalledTimes(2);
  });

  it('should work fine without onProgress', async () => {
    const observable = chunkinator(
      file,
      {
        ...options,
        chunkSize: 3,
        hashingConcurrency: 2,
        probingBatchSize: 2,
        uploadingConcurrency: 2,
        processingBatchSize: 3,
      },
      {},
    );
    await observable.toPromise();
    expect(hashingFunction).toHaveBeenCalledTimes(5);
    expect(probingFunction).toHaveBeenCalledTimes(3);
    expect(uploadingFunction).toHaveBeenCalledTimes(5);
    expect(processingFunction).toHaveBeenCalledTimes(2);
  });

  it('should reject when the hashing has failed', async () => {
    hashingFunction.mockReturnValue(Promise.reject('some-error'));
    const observable = chunkinator(file, options, { onProgress });

    return expect(observable.toPromise()).rejects.toEqual('some-error');
  });

  it('should reject when the probing has failed', async () => {
    probingFunction.mockReturnValue(Promise.reject('some-error'));
    const observable = chunkinator(file, options, { onProgress });

    return expect(observable.toPromise()).rejects.toEqual('some-error');
  });

  it('should reject when the upload has failed', () => {
    uploadingFunction.mockReturnValue(Promise.reject('some-error'));
    const observable = chunkinator(file, options, { onProgress });

    return expect(observable.toPromise()).rejects.toEqual('some-error');
  });

  it('should reject when the processing has failed', async () => {
    processingFunction.mockReturnValue(Promise.reject('some-error'));
    const observable = chunkinator(file, options, { onProgress });

    return expect(observable.toPromise()).rejects.toEqual('some-error');
  });

  it('should call onProgress callback on every uploaded chunk', async () => {
    const observable = chunkinator(file, options, { onProgress });
    await observable.toPromise();

    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress.mock.calls[0][0]).toBeCloseTo(0.333);
    expect(onProgress.mock.calls[1][0]).toBeCloseTo(0.666);
    expect(onProgress.mock.calls[2][0]).toBeCloseTo(0.999);
  });

  it('should call processingFunction callback', async () => {
    const observable = chunkinator(file, options, { onProgress });
    await observable.toPromise();
    expect(processingFunction).toHaveBeenCalledTimes(2);
    expect(processingFunction.mock.calls[0][0]).toEqual([
      { blob: new Blob(['12345']), exists: false, hash: 'random-hash-5' },
      { blob: new Blob(['67890']), exists: false, hash: 'random-hash-5' },
    ]);
    expect(processingFunction.mock.calls[1][0]).toEqual([
      { blob: new Blob(['12345']), exists: false, hash: 'random-hash-5' },
    ]);
  });
});
