import { type Auth, type AuthContext } from '@atlaskit/media-core';
import { defaultCollectionName } from './collectionNames';

const cachedAuths: { [key: string]: Promise<Auth> } = {};

export type MediaEnv = 'staging';

type Access = { [resource: string]: string[] };
const accessUrns: { [key: string]: Access } = {
	MediaServicesSample: {
		'urn:filestore:collection:MediaServicesSample': ['read', 'insert'],
		'urn:filestore:chunk:*': ['create', 'read'],
		'urn:filestore:upload': ['create'],
		'urn:filestore:upload:*': ['read', 'update'],
		'urn:filestore:file': ['create'],
		'urn:filestore:file:*': ['read', 'update'],
	},
	'mediapicker-test': {
		'urn:filestore:collection': ['create'],
		'urn:filestore:collection:mediapicker-test': ['read', 'insert'],
		'urn:filestore:chunk:*': ['create', 'read'],
		'urn:filestore:upload': ['create'],
		'urn:filestore:upload:*': ['read', 'update'],
		'urn:filestore:file': ['create'],
		'urn:filestore:file:*': ['read', 'update'],
	},
};

const requestAuthProvider = async (
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

	// We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
	return response.json();
};

export const mediaPickerAuthProvider =
	(authEnvironment: string = 'asap', env: MediaEnv = 'staging') =>
	(context?: AuthContext) => {
		const collectionName = (context && context.collectionName) || defaultCollectionName;
		authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
		const cacheKey = `${collectionName}:${authEnvironment}`;

		if (!cachedAuths[cacheKey]) {
			cachedAuths[cacheKey] = requestAuthProvider(authEnvironment, collectionName, env);
		}
		return cachedAuths[cacheKey];
	};
