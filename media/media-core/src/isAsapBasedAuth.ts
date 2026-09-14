import type { AsapBasedAuth, Auth } from './auth';

export function isAsapBasedAuth(auth: Auth): auth is AsapBasedAuth {
	return !!(auth as AsapBasedAuth).asapIssuer;
}
