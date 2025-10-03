import type { ADFFetchProvider, ADFWriteProvider, SyncBlockData } from '../common/types';

const inMemStore = new Map<string, SyncBlockData>();
export const inMemoryFetchProvider: ADFFetchProvider = {
	fetchData: (resourceId: string) => {
		const data = inMemStore.get(resourceId);
		if (!data) {
			return Promise.reject(new Error('Data not found'));
		}
		return Promise.resolve(data);
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
