import type { MediaStoreGetFileImageParams } from '../client/media-store/types';

const IMAGE_PARAM_KEYS = new Set([
	'width',
	'height',
	'mode',
	'allowAnimated',
	'upscale',
	'version',
	'max-age',
]);

/**
 * Adds supported image parameters to a pre-signed CDN asset URL without
 * re-parsing or re-encoding its existing query string.
 *
 * Watermarked CloudFront policies anchor `wm-ari` and `wm-v` as a literal
 * suffix, so parameters must be inserted before `wm-ari`. Non-watermarked
 * policies have a trailing wildcard, so parameters can be appended.
 */
export const mapToSeedBasedCdnUrl = (
	seededCdnUrl: string,
	params?: MediaStoreGetFileImageParams,
): string => {
	const insert = Object.entries(params ?? {})
		.filter(([key, value]) => value != null && IMAGE_PARAM_KEYS.has(key))
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join('&');
	if (!insert) {
		return seededCdnUrl;
	}
	const wm = seededCdnUrl.search(/[?&]wm-ari=/);
	if (wm !== -1) {
		const separator = seededCdnUrl[wm];
		return `${seededCdnUrl.slice(0, wm)}${separator}${insert}&${seededCdnUrl.slice(wm + 1)}`;
	}
	return `${seededCdnUrl}${seededCdnUrl.includes('?') ? '&' : '?'}${insert}`;
};
