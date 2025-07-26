import {
	FEDRAMP_MODERATE,
	ISOLATED_CLOUD_PERIMETERS,
	type IsolatedCloudPerimeterType,
} from '../../common/constants';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

/**
 * Determines if the current perimeter is an Isolated Cloud L2 perimeter
 *
 * Warning: Currently unsupported in SSR for the time-being.
 *
 * @returns {boolean} - True if the current perimeter is an Isolated Cloud perimeter, false otherwise
 */
export function isIsolatedCloud(): boolean {
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	if (!atlCtxCookieValues) {
		// If the cookies are not set, the current perimeter is non-isolated commercial
		return false;
	}

	// The icDomain check is needed for when federal perimeters are eventually added to Isolated Cloud as well
	return (
		ISOLATED_CLOUD_PERIMETERS.includes(
			atlCtxCookieValues.perimeter as IsolatedCloudPerimeterType,
		) && atlCtxCookieValues.icDomain !== undefined
	);
}

/**
 * Determines if the current perimeter is FedRAMP Moderate.
 * Please note that FedRAMP Moderate is not currently in Isolated Cloud, but when it is, this function will still return true.
 *
 * Warning: Currently unsupported in SSR for the time-being.
 *
 * @returns {boolean} - True if the current perimeter is FedRAMP Moderate, false otherwise
 */
export function isFedrampModerate(): boolean {
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	if (!atlCtxCookieValues) {
		// If the cookies are not set, the current perimeter is non-isolated commercial
		return false;
	}
	return atlCtxCookieValues.perimeter === FEDRAMP_MODERATE;
}

/**
 * Retrieves the customer selected IC domain name.
 *
 * Warning: Currently unsupported in SSR for the time-being.
 *
 * @returns {string | undefined} - The Isolated Cloud domain name if applicable, undefined otherwise (ex. if not in Isolated Cloud)
 */
export function isolatedCloudDomain(): string | undefined {
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	return atlCtxCookieValues?.icDomain;
}
