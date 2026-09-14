import type { Auth } from '@atlaskit/media-core/auth';

import { MediaStoreError } from './MediaStoreError';

export const resolveInitialAuth = (auth?: Auth): Auth => {
	if (!auth) {
		throw new MediaStoreError('missingInitialAuth');
	}
	return auth;
};
