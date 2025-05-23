import {
	ATL_CTX_ISOLATION_CONTEXT_DOMAIN,
	ATL_CTX_ISOLATION_CONTEXT_ID,
	ATL_CTX_PERIMETER,
	type AtlCtxCookieName,
	type GeneralizedPerimeterType,
} from '../../common/constants';

export type AtlCtxCookieValues = {
	perimeter: GeneralizedPerimeterType;
	icDomain: string | undefined; // undefined when not in Isolated Cloud
	icId: string | undefined; // undefined when not in Isolated Cloud
};

/**
 * Internal helper function used to parse cookie values and extract value of provided cookie name
 * @param {AtlCtxCookieName} cookieName - The name of the cookie to extract
 * @param {string} cookieString - The full cookie string
 * @returns {string | undefined} - The cookie value if present, undefined otherwise
 */
function getRawCookieValue(cookieName: string, cookieString: AtlCtxCookieName): string | undefined {
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

/**
 * Internal helper function used to return the atl-ctx cookies (which contains perimeter and ic_domain information).
 * Cookies are NOT set for regular commercial traffic.
 * @returns {AtlCtxCookieValues | undefined} - The parsed cookie contents or undefined if parsing fails (ex. if the cookies do not exist)
 */
export function parseAtlCtxCookies(): AtlCtxCookieValues | undefined {
	const global: any = globalThis;

	try {
		const cookies = global.document.cookie;
		const perimeter = getRawCookieValue(ATL_CTX_PERIMETER, cookies);

		if (!perimeter) {
			// Indicative of non-isolated commercial perimeter
			return undefined;
		}

		const icDomain = getRawCookieValue(ATL_CTX_ISOLATION_CONTEXT_DOMAIN, cookies);
		const icId = getRawCookieValue(ATL_CTX_ISOLATION_CONTEXT_ID, cookies);

		// The IC Domain and IC Id cookie values are empty strings for non Isolated Cloud
		const emptyIcDomain = !icDomain || icDomain.length === 0;
		const emptyIcId = !icId || icId.length === 0;

		return {
			perimeter: perimeter as GeneralizedPerimeterType,
			icDomain: emptyIcDomain ? undefined : icDomain,
			icId: emptyIcId ? undefined : icId,
		};
	} catch (e) {
		console.warn('Failed to parse atl-ctx cookies:', e);
		return undefined;
	}
}
