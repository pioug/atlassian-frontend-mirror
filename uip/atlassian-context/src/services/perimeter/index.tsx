import { FEDRAMP_MODERATE, L2_PERIMETER_TYPES, PerimeterType } from '../../common/constants';

import { AtlContextCookie, parseAtlCtxCookie } from './utils';

/**
 * Determines if the current perimeter is an Isolated Cloud L2 perimeter
 *
 * WARNING: This function depends on the availability of the `atl-context` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this note is still visible, this likely means that the cookie is not available yet.
 *
 * @returns {boolean} - True if the current perimeter is an Isolated Cloud perimeter, false otherwise
 */
export function isIsolatedCloud(): boolean {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();
	return isL2Perimeter(atlCtxCookie);
}

/**
 * Determines if the current perimeter is FedRAMP Moderate
 *
 * WARNING: This function depends on the availability of the `atl-context` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this warning is still visible, this likely means that the cookie is not available yet.
 *
 * @returns {boolean} - True if the current perimeter is FedRAMP Moderate, false otherwise
 */
export function isFedrampModerate(): boolean {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();
	const perimeter = atlCtxCookie?.perimeter as PerimeterType;
	return perimeter === FEDRAMP_MODERATE;
}

/**
 * Retrieves the customer selected IC domain name
 *
 * WARNING: This function depends on the availability of the `atl-context` cookie, which is to be set by Isolated Cloud GlobalEdge.
 * If this warning is still visible, this likely means that the cookie is not available yet.
 *
 * @returns {string | undefined} - The Isolated Cloud domain name if applicable, undefined otherwise (ex. if not in Isolated Cloud)
 */
export function isolatedCloudDomain(): string | undefined {
	const atlCtxCookie: AtlContextCookie | undefined = parseAtlCtxCookie();
	return isL2Perimeter(atlCtxCookie) ? atlCtxCookie?.ic_domain : undefined;
}

/**
 * Determines if the current perimeter is an L2 perimeter
 * @param {AtlContextCookie | undefined} atlCtxCookie - The atl-ctx cookie
 * @returns {boolean} - True if the current perimeter is in the list of L2 perimeters, false otherwise
 */
function isL2Perimeter(atlCtxCookie?: AtlContextCookie): boolean {
	const perimeter = atlCtxCookie?.perimeter as PerimeterType;
	return perimeter !== undefined && L2_PERIMETER_TYPES.has(perimeter);
}
