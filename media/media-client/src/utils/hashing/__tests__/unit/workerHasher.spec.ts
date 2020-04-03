jest.mock('rusha');

jest.mock('uuid/v4', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(),
}));

import uuidV4 from 'uuid/v4';
import Rusha from 'rusha';

import { WorkerHasher } from '../../workerHasher';

interface FakeWorker {
  addEventListener: jest.Mock<any>;
  postMessage: jest.Mock<any>;
}

describe('WorkerHasher', () => {
  let fakeWorkers: Array<FakeWorker> = [];
  let createWorkerStub = jest.fn();

  beforeEach(() => {
    fakeWorkers = [];
    createWorkerStub = jest.fn().mockImplementation(() => {
      const newWorker = {
        activeJobs: 0,
        addEventListener: jest.fn(),
        postMessage: jest.fn(),
      };
      fakeWorkers.push(newWorker);
      return newWorker;
    });

    (Rusha.createWorker as any) = createWorkerStub;
  });

  afterAll(() => {
    ((uuidV4 as () => string) as jest.Mock<string>).mockClear();
  });

  it('should start 5 workers if 5 workers are specified in the constructor', () => {
    // eslint-disable-next-line no-unused-expressions
    new WorkerHasher(5);
    expect(createWorkerStub).toHaveBeenCalledTimes(5);
  });

  it('should hash provided blobs', () => {
    // We going to hash 2 blobs
    const blob1: Blob = new Blob([]);
    const blob2: Blob = new Blob([]);

    // There will be 3 hasher workers inside
    const hasher = new WorkerHasher(3);

    // All workers should register 'message' callback
    expect(fakeWorkers[0].addEventListener).toHaveBeenCalledWith(
      'message',
      expect.anything(),
    );
    expect(fakeWorkers[1].addEventListener).toHaveBeenCalledWith(
      'message',
      expect.anything(),
    );
    expect(fakeWorkers[2].addEventListener).toHaveBeenCalledWith(
      'message',
      expect.anything(),
    );

    // We mock uuid.v4() call to generate unique ids for both blobs
    ((uuidV4 as () => string) as jest.Mock<string>).mockReturnValueOnce(
      'my-first-id',
    );
    ((uuidV4 as () => string) as jest.Mock<string>).mockReturnValueOnce(
      'my-second-id',
    );

    // Execute hash for first blob and verify returned hash
    const promise1 = hasher.hash(blob1).then(hash => {
      expect(hash).toEqual('some-hash');
    });

    // Execute hash for second blob and verify returned hash
    const promise2 = hasher.hash(blob2).then(hash => {
      expect(hash).toEqual('some-other-hash');
    });

    // First worker get's first job (first blob and first id)
    expect(fakeWorkers[0].postMessage).toHaveBeenCalledTimes(1);
    expect(fakeWorkers[0].postMessage).toHaveBeenCalledWith({
      id: 'my-first-id',
      data: blob1,
    });

    // Since we have logic that picks worker with least number of jobs,
    // second worker gets second job (second blob and second id)
    expect(fakeWorkers[1].postMessage).toHaveBeenCalledTimes(1);
    expect(fakeWorkers[1].postMessage).toHaveBeenCalledWith({
      id: 'my-second-id',
      data: blob2,
    });

    // Third worker hasn't been called since we have only two blobs
    expect(fakeWorkers[2].postMessage).not.toHaveBeenCalled();

    // Get access to 'message' callback of a first worker
    const messageCallback1 = fakeWorkers[0].addEventListener.mock.calls[0][1];
    // Mock webworker calling it with data
    messageCallback1({
      data: {
        id: 'my-first-id',
        hash: 'some-hash',
      },
    });

    const messageCallback2 = fakeWorkers[1].addEventListener.mock.calls[0][1];
    messageCallback2({
      data: {
        id: 'my-second-id',
        hash: 'some-other-hash',
      },
    });

    return Promise.all([promise1, promise2]);
  });

  it('should reject when one of the workers fails', () => {
    const blob: Blob = new Blob([]);

    const hasher = new WorkerHasher(1);

    ((uuidV4 as () => string) as jest.Mock<string>).mockReturnValueOnce(
      'my-first-id',
    );

    // Execute hash for first blob and verify returned hash
    const promise = hasher.hash(blob).then(
      () => {
        throw new Error('Promise was expected to reject');
      },
      error => {
        expect(error).toEqual('some-error');
      },
    );

    // First worker get's first job (first blob and first id)
    expect(fakeWorkers[0].postMessage).toHaveBeenCalledTimes(1);
    expect(fakeWorkers[0].postMessage).toHaveBeenCalledWith({
      id: 'my-first-id',
      data: blob,
    });

    // Get access to 'message' callback of a first worker
    const messageCallback = fakeWorkers[0].addEventListener.mock.calls[0][1];
    // Mock webworker calling it with data
    messageCallback({
      data: {
        id: 'my-first-id',
        error: 'some-error',
      },
    });

    return promise;
  });
});
