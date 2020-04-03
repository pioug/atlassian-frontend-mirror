jest.mock('../../simpleHasher');
jest.mock('../../workerHasher');

import { SimpleHasher } from '../../simpleHasher';
import { WorkerHasher } from '../../workerHasher';
import { createHasher, destroyHasher } from '../../hasherCreator';

describe('createHasher', () => {
  const SimpleHasherStub: jest.Mock<SimpleHasher> = SimpleHasher as any;
  const WorkerHasherStub: jest.Mock<WorkerHasher> = WorkerHasher as any;

  beforeEach(() => {
    destroyHasher();
    SimpleHasherStub.mockReset();
    WorkerHasherStub.mockReset();
  });

  it('should create WorkerHasher by default', async () => {
    const hasher = await createHasher();
    expect(hasher).toEqual(WorkerHasherStub.mock.instances[0]);
  });

  it('should create SimpleHasher if WorkerHasher throws an exception', async () => {
    WorkerHasherStub.mockImplementation(() => {
      throw new Error('some-error');
    });

    const hasher = await createHasher();
    expect(hasher).toEqual(SimpleHasherStub.mock.instances[0]);
  });
});
