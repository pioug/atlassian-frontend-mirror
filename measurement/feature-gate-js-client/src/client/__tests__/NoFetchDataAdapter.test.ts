import { StatsigClient } from '@statsig/js-client';

import { NoFetchDataAdapter } from '../NoFetchDataAdapter';

describe('NoFetchDataAdapter', () => {
	it('gets bootstrap data', async () => {
		const adapter = new NoFetchDataAdapter();
		new StatsigClient('mock-client-key', {}, { dataAdapter: adapter });

		const emptyResult = await adapter.getDataAsync(null, {});
		expect(emptyResult).toEqual(null);

		adapter.setBootstrapData({ test: 123 });
		const dataResult = await adapter.getDataAsync(null, {});
		expect(dataResult).toEqual({
			data: JSON.stringify({ test: 123 }),
			source: 'Bootstrap',
			receivedAt: expect.any(Number),
			fullUserHash: expect.any(String),
			stableID: expect.any(String),
		});
	});

	it('JSON stringifies without circular reference or unnecessary data', async () => {
		const adapter = new NoFetchDataAdapter();
		new StatsigClient('mock-client-key', {}, { dataAdapter: adapter });

		expect(JSON.parse(JSON.stringify(adapter))).toEqual({
			_adapterName: 'NoFetchDataAdapter',
			_cacheLimit: 10,
			_cacheSuffix: 'nofetch',
			_lastModifiedStoreKey: 'statsig.last_modified_time.nofetch',
			_sdkKey: 'mock-client-key',
		});
	});
});
