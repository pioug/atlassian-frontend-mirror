import { type MediaFileArtifacts } from '@atlaskit/media-state';
import { isCDNEnabled } from '../utils/mediaCdn';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	// eslint-disable-next-line @atlaskit/platform/no-preconditioning
	if (isCDNEnabled() && artifacts[prop]?.url) {
		return `${artifacts[prop]?.url}/cdn`;
	}
	return artifacts[prop]?.url;
};
