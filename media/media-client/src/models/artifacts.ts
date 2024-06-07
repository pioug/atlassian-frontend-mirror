import { type MediaFileArtifacts } from '@atlaskit/media-state';

export const getArtifactUrl = (
	artifacts: MediaFileArtifacts,
	prop: keyof MediaFileArtifacts,
): string | undefined => {
	return artifacts[prop]?.cdnUrl || artifacts[prop]?.url;
};
