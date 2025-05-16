import { MediaClient } from '@atlaskit/media-client';

import { getMediaClient, mediaClientsMap } from './getMediaClient';

describe('getMediaClient', () => {
	beforeEach(() => {
		// Clear the mediaClientsMap before each test
		mediaClientsMap.clear();
	});

	it('should create a new MediaClient when config is provided', () => {
		const config = {
			authProvider: () =>
				Promise.resolve({
					clientId: 'test-client',
					token: 'test-token',
					baseUrl: 'https://test-url',
				}),
		};

		const mediaClient = getMediaClient(config);

		expect(mediaClient).toBeInstanceOf(MediaClient);
		expect(mediaClientsMap.get(config)).toBe(mediaClient);
	});

	it('should reuse existing MediaClient when same config is provided', () => {
		const config = {
			authProvider: () =>
				Promise.resolve({
					clientId: 'test-client',
					token: 'test-token',
					baseUrl: 'https://test-url',
				}),
		};

		const firstClient = getMediaClient(config);
		const secondClient = getMediaClient(config);

		expect(firstClient).toBe(secondClient);
		expect(mediaClientsMap.size).toBe(1);
	});

	it('should create a default MediaClient when no config is provided', () => {
		const mediaClient = getMediaClient(undefined as any);

		expect(mediaClient).toBeInstanceOf(MediaClient);
		expect(mediaClientsMap.size).toBe(0); // Default client is not stored in the map
	});

	it('should create different MediaClients for different configs', () => {
		const config1 = {
			authProvider: () =>
				Promise.resolve({
					clientId: 'client1',
					token: 'token1',
					baseUrl: 'https://url1',
				}),
		};

		const config2 = {
			authProvider: () =>
				Promise.resolve({
					clientId: 'client2',
					token: 'token2',
					baseUrl: 'https://url2',
				}),
		};

		const client1 = getMediaClient(config1);
		const client2 = getMediaClient(config2);

		expect(client1).not.toBe(client2);
		expect(mediaClientsMap.size).toBe(2);
	});
});
