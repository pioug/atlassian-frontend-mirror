import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';

export type AuthSessionHelper = {
	token: string;
	clientId: string;
};

export const createAuthSession = async (): Promise<AuthSessionHelper> => {
	const mediaConfig = await createUploadMediaClientConfig();
	const authProvider = await mediaConfig.authProvider();

	return {
		token: authProvider.token,
		clientId: '0f0bf205-4a4f-41e9-951c-dd7502171d2d',
	};
};

export const transformAuthHeaders = (auth: AuthSessionHelper) => {
	return {
		Authorization: `Bearer ${auth.token}`,
		'X-Client-Id': auth.clientId,
	};
};
export const mediaBaseUrl = 'https://media.staging.atl-paas.net';
