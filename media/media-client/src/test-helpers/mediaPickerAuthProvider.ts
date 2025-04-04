import { type Auth, type AuthContext } from '@atlaskit/media-core';
import { defaultCollectionName } from './collectionNames';

export const authProviderBaseURL = 'https://media.staging.atl-paas.net';
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

	// We leverage the fact, that our internal /token/tenant API returns data in the same format as Auth
	return response.json();
};

export const mediaPickerAuthProvider =
	(authEnvironment: string = 'asap', env?: MediaEnv) =>
	(context?: AuthContext) => {
		const collectionName = (context && context.collectionName) || defaultCollectionName;
		authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
		const cacheKey = `${collectionName}:${authEnvironment}`;

		if (!cachedAuths[cacheKey]) {
			cachedAuths[cacheKey] = requestAuthProvider(authEnvironment, collectionName, env);
		}
		return cachedAuths[cacheKey];
	};

export const defaultMediaPickerAuthProvider = () => (): Promise<Auth> => {
	const auth: Auth = {
		clientId: 'a89be2a1-f91f-485c-9962-a8fb25ccfa13',
		token:
			'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhODliZTJhMS1mOTFmLTQ4NWMtOTk2Mi1hOGZiMjVjY2ZhMTMiLCJ1bnNhZmUiOnRydWUsImlhdCI6MTQ3MzIyNTEzNn0.6Isj5jKgKzWDnPqfoMLiC_LVIlGM8kg_wxG6eGGwhTw',
		baseUrl: authProviderBaseURL,
	};

	return Promise.resolve(auth);
};
