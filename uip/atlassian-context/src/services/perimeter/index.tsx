import {
	FEDRAMP_MODERATE,
	GeneralizedPerimeterType,
	ISOLATED_CLOUD_PERIMETERS,
	IsolatedCloudPerimeterType,
} from '../../common/constants';

import { AtlContextCookie, parseAtlCtxCookie } from './utils';

/**
 * WARNING: This function depends on the availability of the `atl-ctx` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this note is still visible, this likely means that the cookie is not available yet.
 *
 * Determines if the current perimeter is an Isolated Cloud L2 perimeter
 *
 * @returns {boolean} - True if the current perimeter is an Isolated Cloud perimeter, false otherwise
 */
export function isIsolatedCloud(): boolean {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();

	const perimeter = atlCtxCookie?.perimeter as GeneralizedPerimeterType;
	const icDomain = atlCtxCookie?.ic_domain;

	// The icDomain check is needed for when federal perimeters are eventually added to Isolated Cloud as well
	return (
		perimeter != null &&
		ISOLATED_CLOUD_PERIMETERS.includes(perimeter as IsolatedCloudPerimeterType) &&
		icDomain != null
	);
}

/**
 * WARNING: This function depends on the availability of the `atl-ctx` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this warning is still visible, this likely means that the cookie is not available yet.
 *
 * Determines if the current perimeter is FedRAMP Moderate.
 * Please note that FedRAMP Moderate is not currently in Isolated Cloud, but when it is, this function will still return true.
 *
 * @returns {boolean} - True if the current perimeter is FedRAMP Moderate, false otherwise
 */
export function isFedrampModerate(): boolean {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();
	const perimeter = atlCtxCookie?.perimeter as GeneralizedPerimeterType;
	return perimeter === FEDRAMP_MODERATE;
}

/**
 * WARNING: This function depends on the availability of the `atl-context` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this warning is still visible, this likely means that the cookie is not available yet.
 *
 * Retrieves the customer selected IC domain name
 *
 * @returns {string | undefined} - The Isolated Cloud domain name if applicable, undefined otherwise (ex. if not in Isolated Cloud)
 */
export function isolatedCloudDomain(): string | undefined {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();
	return atlCtxCookie?.ic_domain;
}
