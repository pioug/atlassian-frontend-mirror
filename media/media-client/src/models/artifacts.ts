import { type MediaFileArtifacts } from '@atlaskit/media-state';

export const getArtifactUrl = (
  artifacts: MediaFileArtifacts,
  prop: keyof MediaFileArtifacts,
): string | undefined => {
  const artifact = artifacts[prop];

  if (!artifact || !artifact.url) {
    return undefined;
  }

  return artifact.url;
};
