import { fg } from '@atlaskit/platform-feature-flags';

export const MEDIA_CDN_MAP: { [key: string]: string } = {
	'api.media.atlassian.com': 'media-cdn.atlassian.com',
	'media.staging.atl-paas.net': 'media-cdn.stg.atlassian.com',
};

export function mapToMediaCdnUrl(url: string) {
	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
	if (fg('platform.media-cdn-delivery') && fg('platform.media-cdn-single-host')) {
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
