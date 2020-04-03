import { Hasher } from './hasher';

let hasher: Hasher | null = null;

export const destroyHasher = () => (hasher = null);

export const createHasher = async (): Promise<Hasher> => {
  const numWorkers = 3;

  if (!hasher) {
    try {
      const { WorkerHasher } = await import('./workerHasher');
      hasher = new WorkerHasher(numWorkers);
    } catch (error) {
      const { SimpleHasher } = await import('./simpleHasher');
      hasher = new SimpleHasher();
    }
  }

  return hasher;
};
