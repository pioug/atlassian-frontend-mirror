import { type IsolatedCloudPerimeterType } from '../../common/constants';
import { ISOLATED_CLOUD_PERIMETERS } from '../../common/constants/isolated-cloud-perimeters';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

export function isIsolatedCloud(): boolean {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return globalThis.ssrContext?.isInIC ?? false;
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
