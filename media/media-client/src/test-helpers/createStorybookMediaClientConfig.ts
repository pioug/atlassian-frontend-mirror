import type { MediaClientConfig } from '@atlaskit/media-core/auth';

import type { AuthParameter } from './AuthParameter';
import { StoryBookAuthProvider } from './authProvider';
import { collectionNames } from './collectionNames';
import { defaultAuthParameter } from './defaultAuthParameter';

export const createStorybookMediaClientConfig = (
	authParameter: AuthParameter = defaultAuthParameter,
): MediaClientConfig => {
	const scopes: { [resource: string]: string[] } = {
		'urn:filestore:file:*': ['read'],
		'urn:filestore:chunk:*': ['read'],
	};
	collectionNames.forEach((c) => {
		scopes[`urn:filestore:collection:${c}`] = ['read', 'update'];
	});

	const isAsapEnvironment = authParameter.authType === 'asap';
	const authProvider = StoryBookAuthProvider.create(isAsapEnvironment, scopes);
	return { authProvider };
};
