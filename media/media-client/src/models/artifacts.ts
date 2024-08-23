import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { mapToMediaCdnUrl } from '../utils/mediaCdn';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	if (fg('platform.media-cdn-delivery')) {
		return mapToMediaCdnUrl(`${artifacts[prop]?.url}/cdn`);
	}
	return artifacts[prop]?.url;
};
