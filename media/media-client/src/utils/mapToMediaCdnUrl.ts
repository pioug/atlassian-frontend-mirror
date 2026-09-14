import { isGoogleCloudPlatform } from '@atlaskit/atlassian-context/cloud-provider';
import { isGCPtenant as isGCPtenantInStaging } from '@atlaskit/media-common/mediaEnvUtils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isCDNEnabled } from './isCDNEnabled';
import { MEDIA_CDN_MAP, MEDIA_TOKEN_LENGTH_LIMIT } from './mediaCdn';

export function mapToMediaCdnUrl(url: string, token: string): string {
	const tokenLength = token?.length ?? 0;
	if (!isCDNEnabled() || tokenLength > MEDIA_TOKEN_LENGTH_LIMIT) {
		return url;
	}

	const isGcpTenant = isGoogleCloudPlatform() || isGCPtenantInStaging();
	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
	if (!isGcpTenant && fg('platform_media_cdn_delivery') && fg('platform_media_cdn_single_host')) {
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
