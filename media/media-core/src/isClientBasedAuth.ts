import type { Auth, ClientBasedAuth } from './auth';

export function isClientBasedAuth(auth: Auth): auth is ClientBasedAuth {
	return !!(auth as ClientBasedAuth).clientId;
}
