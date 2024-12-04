import type { Auth, AuthContext } from '@atlaskit/media-core';
import { MEDIA_PLAYGROUND_BASE_URL } from './mediaBaseURLS';

let mediaCachedAuth: { [key: string]: Promise<Auth> } = {};

const access = {
	'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
	'urn:filestore:chunk:*': ['create', 'read'],
	'urn:filestore:upload': ['create'],
	'urn:filestore:upload:*': ['read', 'update'],
	'urn:filestore:file': ['create'],
	'urn:filestore:file:*': ['read', 'update'],
};

export const requestMediaAuthProvider = async (): Promise<Auth> => {
	const url = `${MEDIA_PLAYGROUND_BASE_URL}/token/tenant?environment=asap`;
	const body = JSON.stringify({
		access,
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

export const getMediaAuthProvider = (_context?: AuthContext): Promise<Auth> => {
	const collectionName = 'EditorExample';
	const cacheKey = `${collectionName}:asap`;

	if (!mediaCachedAuth[cacheKey]) {
		mediaCachedAuth[cacheKey] = requestMediaAuthProvider();
	}
	return mediaCachedAuth[cacheKey];
};
