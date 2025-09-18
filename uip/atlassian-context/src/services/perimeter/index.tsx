import {
	type CloudEnvironment,
	COMMERCIAL,
	FEDRAMP_MODERATE,
	ISOLATED_CLOUD_PERIMETERS,
	type IsolatedCloudPerimeterType,
} from '../../common/constants';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

/**
 * Determines if the current perimeter is an Isolated Cloud L2 perimeter
 *
 * @returns {boolean} True if the current perimeter is an Isolated Cloud perimeter, false otherwise
 */
export function isIsolatedCloud(): boolean {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return globalThis.ssrContext.isInIC;
	}

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
 * @returns {boolean} True if the current perimeter is FedRAMP Moderate, false otherwise
 */
export function isFedrampModerate(): boolean {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return globalThis.ssrContext.isInFedramp;
	}

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
 *
 * @returns {string | undefined} The Isolated Cloud domain name if applicable, undefined otherwise (ex. if not in Isolated Cloud)
 */
export function isolatedCloudDomain(): string | undefined {
	if (typeof document === 'undefined') {
		return globalThis.location.hostname;
	}
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	return atlCtxCookieValues?.icDomain;
}

/**
 * Returns the Isolation Context identifier
 *
 * @returns {string | undefined} The Isolation Context ID if applicable, undefined otherwise (ex. if not in Isolated Cloud)
 */
export function isolationContextId(): string | undefined {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return isIsolatedCloud() ? globalThis.ssrContext.icName : undefined;
	}

	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	return atlCtxCookieValues?.icId;
}

/**
 * Returns information about the current environment for internal use
 * @returns {string | undefined} if the current environment is in isolated cloud + what the current perimeter is. Returns undefined when a new cloud environment has been created but not added to this library
 */
export function cloudEnvironment(): CloudEnvironment | undefined {
	if (typeof document === 'undefined') {
		return cloudEnvironmentSsrLookup();
	}
	return cloudEnvironmentCookieLookup();
}

function cloudEnvironmentSsrLookup(): CloudEnvironment {
	// @ts-ignore
	if (globalThis.ssrContext.isInIC === true) {
		return {
			type: 'isolated-cloud',
			perimeter: COMMERCIAL,
		};
	}
	// @ts-ignore
	if (globalThis.ssrContext.isInFedramp === true) {
		return {
			type: 'non-isolated-cloud',
			perimeter: FEDRAMP_MODERATE,
		};
	}
	return {
		type: 'non-isolated-cloud',
		perimeter: COMMERCIAL,
	};
}

function cloudEnvironmentCookieLookup(): CloudEnvironment | undefined {
	// Avoid calling isFedrampModerate() and isIsolatedCloud() here to avoid repeated cookie parsing
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	if (!atlCtxCookieValues) {
		// If the cookies are not set, the current perimeter is non-isolated commercial
		return {
			type: 'non-isolated-cloud',
			perimeter: COMMERCIAL,
		};
	}

	const isIc =
		ISOLATED_CLOUD_PERIMETERS.includes(
			atlCtxCookieValues.perimeter as IsolatedCloudPerimeterType,
		) && atlCtxCookieValues.icDomain !== undefined;

	if (isIc) {
		return {
			type: 'isolated-cloud',
			perimeter: COMMERCIAL,
		};
	}

	if (atlCtxCookieValues.perimeter === FEDRAMP_MODERATE) {
		return {
			type: 'non-isolated-cloud',
			perimeter: FEDRAMP_MODERATE,
		};
	}

	// If a new cloud environment has been created but not added to this library, return undefined
	return undefined;
}
