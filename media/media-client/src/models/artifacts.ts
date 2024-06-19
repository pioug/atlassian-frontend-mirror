import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	if (getBooleanFF('platform.media-cdn-delivery')) {
		return artifacts[prop]?.cdnUrl || artifacts[prop]?.url;
	}
	return artifacts[prop]?.url;
};
