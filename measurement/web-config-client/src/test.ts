import { ConfigCollection } from '@atlaskit/config-common-libs';

import { ConfigClient } from './main';

describe(ConfigClient.name, () => {
	test('it does a fetch', async () => {
		const mockFetch = jest.fn().mockResolvedValue({
			text: jest.fn().mockResolvedValue('{}'),
			status: 200,
			ok: true,
		});
		const promise = ConfigClient.fetch({
			context: {
				namespace: 'mock_app_web',
				identifiers: {
					atlassianAccountId: 'asdf',
				},
				metadata: {},
			},
			ffsApiKey: 'mock-ffs-api-key',
			ffsBaseUrl: 'mock-ffs-base-url',
			fetch: mockFetch,
		});

		await expect(promise).resolves.toEqual(ConfigCollection.fromValues('{}'));
		expect(mockFetch).toHaveBeenCalledWith('mock-ffs-base-url/api/v2/configurations', {
			method: 'POST',
			body: '{"namespace":"mock_app_web","identifiers":{"atlassianAccountId":"asdf"},"metadata":{}}',
			headers: {
				'content-type': 'application/json',
				'x-api-key': 'mock-ffs-api-key',
			},
		});
	});
});
