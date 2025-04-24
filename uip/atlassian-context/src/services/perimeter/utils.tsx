export type AtlContextCookie = {
	perimeter: string;
	ic_domain: string;
};

/**
 * Internal helper function used to parse cookie values and extract value of provided cookie name
 * The cookie value must be valid json
 * @param {string} cookieName - The name of the cookie to extract
 * @param {string} cookieString - The full cookie string
 * @returns {string | undefined} - The cookie value if present, undefined otherwise
 */
function getRawCookieJsonValue(cookieName: string, cookieString: string): string | undefined {
	const cookies = cookieString.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name === cookieName) {
			return value;
		}
	}
	return undefined;
}

/**
 * Internal helper function used to return the atl-ctx cookie (which contains perimeter and ic_domain information)
 * @returns {AtlContextCookie | undefined} - The parsed cookie contents or undefined if parsing fails
 */
export function parseAtlCtxCookie(): AtlContextCookie | undefined {
	const global: any = globalThis;

	try {
		const cookies = global.document.cookie;
		const cookieValue = getRawCookieJsonValue('atl-ctx', cookies);
		if (cookieValue === undefined) {
			return undefined;
		}
		return JSON.parse(cookieValue);
	} catch (e) {
		console.warn('Failed to parse atl-ctx cookie:', e);
		return undefined;
	}
}
