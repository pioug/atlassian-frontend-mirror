/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import type { Auth, AuthContext } from '@atlaskit/media-core/auth';

import { cachedAuths } from './cachedAuths';
import { defaultCollectionName } from './collectionNames';
import { requestAuthProvider } from './requestAuthProvider';

export const authProviderBaseURL = 'https://media.staging.atl-paas.net';

export type MediaEnv = 'staging';

type Access = { [resource: string]: string[] };

export const accessUrns: { [key: string]: Access } = {
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

export const mediaPickerAuthProvider =
	(authEnvironment: string = 'asap', env?: MediaEnv) =>
	(context?: AuthContext): Promise<Auth> => {
		const collectionName = (context && context.collectionName) || defaultCollectionName;
		authEnvironment = authEnvironment === 'asap' ? 'asap' : '';
		const cacheKey = `${collectionName}:${authEnvironment}`;

		if (!cachedAuths[cacheKey]) {
			cachedAuths[cacheKey] = requestAuthProvider(authEnvironment, collectionName, env);
		}
		return cachedAuths[cacheKey];
	};

/**
 * @deprecated Use `import { defaultMediaPickerAuthProvider } from '@atlaskit/media-client/test-helpers'` instead.
 */
export { defaultMediaPickerAuthProvider } from './defaultMediaPickerAuthProvider';
