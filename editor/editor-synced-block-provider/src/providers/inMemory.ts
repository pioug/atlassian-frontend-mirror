import type { ADFEntity } from '@atlaskit/adf-utils/types';

import type { ADFFetchProvider, ADFWriteProvider } from '../common/types';

const inMemStore = new Map<string, ADFEntity>();
export const inMemoryFetchProvider: ADFFetchProvider = {
	fetchData: (resourceId: string) => {
		return Promise.resolve({
			content: inMemStore.get(resourceId)
		});
	},
};

export const inMemoryWriteProvider: ADFWriteProvider = {
	writeData: (_sourceId: string, _localId: string, data: ADFEntity, resourceId?: string) => {
		if (resourceId) {
			inMemStore.set(resourceId, data);
			return Promise.resolve(resourceId);
		} else {
			const uuid = crypto.randomUUID();
			inMemStore.set(uuid, data);
			return Promise.resolve(uuid);
		}
	},
};
