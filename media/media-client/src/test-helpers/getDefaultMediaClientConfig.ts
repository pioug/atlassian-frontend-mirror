import type { MediaClientConfig } from '@atlaskit/media-core/auth';

export const getDefaultMediaClientConfig = (): MediaClientConfig => ({
	authProvider: jest.fn().mockReturnValue(
		Promise.resolve({
			clientId: 'some-client-id',
			token: 'some-token',
			baseUrl: 'some-service-host',
		}),
	),
});
