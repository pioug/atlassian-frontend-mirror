import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { isCommercial } from '../utils/isCommercial';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	if (isCommercial() && fg('platform.media-cdn-delivery')) {
		return `${artifacts[prop]?.url}/cdn`;
	}
	return artifacts[prop]?.url;
};
