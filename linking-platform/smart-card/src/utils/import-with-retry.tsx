import { sleep } from './sleep';

export const importWithRetry = async <T,>(
	importFn: () => Promise<T>,
	retries = 2,
	interval = 500,
): Promise<T> => {
	try {
		return await importFn();
	} catch (error) {
		if ((error as Error).name === 'ChunkLoadError' && retries > 0) {
			await sleep(interval);
			return importWithRetry(importFn, retries - 1, interval);
		} else {
			throw error;
		}
	}
};
