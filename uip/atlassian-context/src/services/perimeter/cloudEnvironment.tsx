import {
	type CloudEnvironment,
	COMMERCIAL,
	FEDRAMP_MODERATE,
	type IsolatedCloudPerimeterType,
} from '../../common/constants';
import { ISOLATED_CLOUD_PERIMETERS } from '../../common/constants/isolated-cloud-perimeters';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

function cloudEnvironmentSsrLookup(): CloudEnvironment {
	// @ts-ignore
	if (globalThis.ssrContext?.isInIC === true) {
		return {
			type: 'isolated-cloud',
			perimeter: COMMERCIAL,
		};
	}
	// @ts-ignore
	if (globalThis.ssrContext?.isInFedramp === true) {
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

export function cloudEnvironment(): CloudEnvironment | undefined {
	if (typeof document === 'undefined') {
		return cloudEnvironmentSsrLookup();
	}
	return cloudEnvironmentCookieLookup();
}
