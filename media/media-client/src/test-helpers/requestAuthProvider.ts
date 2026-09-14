import type { Auth } from '@atlaskit/media-core/auth';

import { accessUrns } from './mediaPickerAuthProvider';
import type { MediaEnv } from './mediaPickerAuthProvider';

export const requestAuthProvider = async (
	authEnvironment: string,
	collectionName: string,
	env: MediaEnv = 'staging',
): Promise<Auth> => {
	const url = `https://media-playground.${env}.atl-paas.net/token/tenant?environment=${authEnvironment}`;
	const body = JSON.stringify({
		access: accessUrns[collectionName] || {},
	});
	const headers = new Headers();

	headers.append('Content-Type', 'application/json; charset=utf-8');
	headers.append('Accept', 'text/plain, */*; q=0.01');

	const response = await fetch(url, {
		method: 'POST',
		body,
		headers,
	});

	// We leverage the fact, that our internal /token/tenant API returns data in the same format as Auth
	return response.json();
};
