import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

import { isIsolatedCloud } from './isIsolatedCloud';

export function isolationContextId(): string | undefined {
	if (typeof document === 'undefined') {
		// @ts-ignore
		return isIsolatedCloud() ? globalThis.ssrContext?.icName : undefined;
	}

	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	return atlCtxCookieValues?.icId;
}
