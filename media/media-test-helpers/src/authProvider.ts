import { type Auth, type AuthProvider, type AuthContext } from '@atlaskit/media-core';
import { defaultCollectionName } from './collectionNames';
import { MEDIA_PLAYGROUND_BASE_URL } from './mediaBaseURLS';

const cachedAuths: { [key: string]: Promise<Auth> } = {};

export class StoryBookAuthProvider {
	static create(
		isAsapEnvironment: boolean,
		access?: { [resourceUrn: string]: string[] },
		expiresIn = 600,
	): AuthProvider {
		const loadTenatAuth = async (collectionName: string): Promise<Auth> => {
			const environment = isAsapEnvironment ? 'asap' : '';
			const headers = new Headers();
			headers.append('Content-Type', 'application/json; charset=utf-8');
			headers.append('Accept', 'text/plain, */*; q=0.01');
			const config: RequestInit = {
				method: 'POST',
				headers,
				body: access ? JSON.stringify({ access, expiresIn }) : undefined,
			};
			const url = `${MEDIA_PLAYGROUND_BASE_URL}/token/tenant?collection=${collectionName}&environment=${environment}`;
			const response = fetch(url, config);

			// We leverage the fact, that our internal /toke/tenant API returns data in the same format as Auth
			return (await (await response).json()) as Auth;
		};

		return (authContext?: AuthContext): Promise<Auth> => {
			const IS_UNIT_TEST = process.env.JEST_WORKER_ID !== undefined;
			if (IS_UNIT_TEST) {
				// This is to prevent accidental staging environment calls from the auth provider in unit tests
				// The implementation also means that it can effect unrelated tests due to the setInterval and unhandled promise rejection
				throw new Error(
					'Unexpected call to auth provider, please mock the auth provider in your test',
				);
			}
			const collectionName = (authContext && authContext.collectionName) || defaultCollectionName;
			const accessStr = access ? JSON.stringify(access) : '';
			const cacheKey = `${collectionName}-${accessStr}-${isAsapEnvironment}`;

			if (!cachedAuths[cacheKey]) {
				cachedAuths[cacheKey] = loadTenatAuth(collectionName);
				setInterval(
					() => {
						cachedAuths[cacheKey] = loadTenatAuth(collectionName);
					},
					(expiresIn * 1000) / 2,
				);
			}
			return cachedAuths[cacheKey];
		};
	}
}
