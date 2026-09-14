import type { Auth } from '@atlaskit/media-core/auth';
import { isClientBasedAuth } from '@atlaskit/media-core/is-client-based-auth';

export interface ClientBasedAuthHeaders {
	readonly 'X-Client-Id': string;
	readonly Authorization: string;
}

export interface AsapBasedAuthHeaders {
	readonly 'X-Issuer': string;
	readonly Authorization: string;
}

export type AuthHeaders = ClientBasedAuthHeaders | AsapBasedAuthHeaders;

export function mapAuthToAuthHeaders(auth: Auth): AuthHeaders {
	if (isClientBasedAuth(auth)) {
		return {
			'X-Client-Id': auth.clientId,
			Authorization: `Bearer ${auth.token}`,
		};
	} else {
		return {
			'X-Issuer': auth.asapIssuer,
			Authorization: `Bearer ${auth.token}`,
		};
	}
}
