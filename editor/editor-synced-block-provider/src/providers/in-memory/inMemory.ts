import type { SyncBlockData } from '../../common/types';
import type { ADFFetchProvider, ADFWriteProvider } from '../types';

const inMemStore = new Map<string, SyncBlockData>();
export const inMemoryFetchProvider: ADFFetchProvider = {
	fetchData: (resourceId: string) => {
		const data = inMemStore.get(resourceId);
		if (!data) {
			throw new Error('Sync Block Provider (in-mem): Data not found');
		}
		return Promise.resolve({ data, resourceId });
	},
};

export const inMemoryWriteProvider: ADFWriteProvider = {
	writeData: (data: SyncBlockData) => {
		if (data.resourceId) {
			inMemStore.set(data.resourceId, data);
			return Promise.resolve(data.resourceId);
		} else {
			const uuid = crypto.randomUUID();
			inMemStore.set(uuid, data);
			return Promise.resolve(uuid);
		}
	},
};
