import type { Auth } from '@atlaskit/media-core/auth';
import { isClientBasedAuth } from '@atlaskit/media-core/is-client-based-auth';

import { type RequestHeaders } from './types';

export function mapAuthToRequestHeaders(auth?: Auth): RequestHeaders {
	if (!auth) {
		return {};
	}
	if (isClientBasedAuth(auth)) {
		return {
			'X-Client-Id': auth.clientId,
			Authorization: `Bearer ${auth.token}`,
		};
	}

	return {
		'X-Issuer': auth.asapIssuer,
		Authorization: `Bearer ${auth.token}`,
	};
}
