import { isGoogleCloudPlatform } from '@atlaskit/atlassian-context/cloud-provider';
import { isIsolatedCloud } from '@atlaskit/atlassian-context/is-isolated-cloud';
import { isGCPtenant as isGCPtenantInStaging } from '@atlaskit/media-common/mediaEnvUtils';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { isCommercial } from './isCommercial';
import { isPathBasedEnabled } from './isPathBasedEnabled';

export function isCDNEnabled(): boolean {
	return (
		isCommercial() &&
		!isIsolatedCloud() &&
		!(isGoogleCloudPlatform() || isGCPtenantInStaging()) &&
		fg('platform_media_cdn_delivery') &&
		!isPathBasedEnabled()
	);
}
