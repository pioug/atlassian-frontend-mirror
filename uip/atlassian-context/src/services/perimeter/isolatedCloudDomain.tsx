import { type AtlCtxCookieValues, parseAtlCtxCookies } from '../atl-cookies-lookup';

export function isolatedCloudDomain(): string | undefined {
	if (typeof document === 'undefined') {
		return globalThis.location?.hostname;
	}
	const atlCtxCookieValues: AtlCtxCookieValues | undefined = parseAtlCtxCookies();
	return atlCtxCookieValues?.icDomain;
}
