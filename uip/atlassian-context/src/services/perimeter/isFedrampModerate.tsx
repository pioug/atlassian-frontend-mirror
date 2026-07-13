import { FEDRAMP_MODERATE } from '../../common/constants';
import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

export function isFedrampModerate(): boolean {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return globalThis.ssrContext?.isInFedramp ?? false;
	}

	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	if (!atlCtxCookieValues) {
		// If the cookies are not set, the current perimeter is non-isolated commercial
		return false;
	}
	return atlCtxCookieValues.perimeter === FEDRAMP_MODERATE;
}
