import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { mapToMediaCdnUrl } from '../utils/mediaCdn';
import { isFedRamp } from '../utils/isFedRamp';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	if (!isFedRamp() && fg('platform.media-cdn-delivery')) {
		return mapToMediaCdnUrl(`${artifacts[prop]?.url}/cdn`);
	}
	return artifacts[prop]?.url;
};
