import { fg } from '@atlaskit/platform-feature-flags';
import { isCommercial } from './isCommercial';
import { isIsolatedCloud } from '@atlaskit/atlassian-context';
import { isPathBasedEnabled } from './pathBasedUrl';

export const MEDIA_CDN_MAP: { [key: string]: string } = {
	'api.media.atlassian.com': 'media-cdn.atlassian.com',
	'media.staging.atl-paas.net': 'media-cdn.stg.atlassian.com',
};

// Cloudfront has a hard limit of 8,192 bytes
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html
// Assuming other parts of the URL make up a max of ~1000 (in reality it's lower), the token can be ~7000
const MEDIA_TOKEN_LENGTH_LIMIT = 7000;

export function isCDNEnabled(): boolean {
	return (
		isCommercial() &&
		!isIsolatedCloud() &&
		fg('platform_media_cdn_delivery') &&
		!isPathBasedEnabled()
	);
}

export function mapToMediaCdnUrl(url: string, token: string) {
	const tokenLength = token?.length ?? 0;
	if (!isCDNEnabled() || tokenLength > MEDIA_TOKEN_LENGTH_LIMIT) {
		return url;
	}

	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
	if (fg('platform_media_cdn_delivery') && fg('platform_media_cdn_single_host')) {
		try {
			const parsedUrl = new URL(url);
			const cdnHost = MEDIA_CDN_MAP[parsedUrl.host];

			// If no mapping is found, return the original URL
			if (!cdnHost) {
				return url;
			}

			// Replace the host with the CDN host in the original URL
			parsedUrl.host = cdnHost;

			return parsedUrl.toString();
		} catch (error) {
			return url;
		}
	}
	return url;
}
