import type { AtlCtxCookieName, BIFROST_ATL_CTX_CLOUD_SERVICE_PROVIDER } from '../constants';

type KnownCookieName = AtlCtxCookieName | typeof BIFROST_ATL_CTX_CLOUD_SERVICE_PROVIDER;

/**
 * Internal helper function used to parse a cookie value by name from a cookie string.
 * @param {string} cookieName - The name of the cookie to extract
 * @param {string} cookieString - The full cookie string (e.g. document.cookie)
 * @returns {string | undefined} - The cookie value if present, undefined otherwise
 */
export function getRawCookieValue(
	cookieName: KnownCookieName,
	cookieString: string,
): string | undefined {
	if (!cookieString) {
		return undefined;
	}

	const cookies = cookieString.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === cookieName) {
			return value;
		}
	}
	return undefined;
}
