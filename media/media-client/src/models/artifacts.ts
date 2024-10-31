import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { fg } from '@atlaskit/platform-feature-flags';
import { isCommercial } from '../utils/isCommercial';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
	if (isCommercial() && fg('platform_media_cdn_delivery') && artifacts[prop]?.url) {
		return `${artifacts[prop]?.url}/cdn`;
	}
	return artifacts[prop]?.url;
};
