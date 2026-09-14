import type { AsapBasedAuth, Auth, ClientAltBasedAuth } from './auth';
import { isAsapBasedAuth } from './isAsapBasedAuth';

export const authToOwner = (auth: Auth): ClientAltBasedAuth | AsapBasedAuth => {
	if (isAsapBasedAuth(auth)) {
		return auth;
	}

	const clientAuth: ClientAltBasedAuth = {
		id: auth.clientId,
		baseUrl: auth.baseUrl,
		token: auth.token,
	};

	return clientAuth;
};
