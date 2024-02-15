import { ResponseFileItem } from '@atlaskit/media-client';
import type {
  MediaFileArtifact,
  MediaFileArtifacts,
} from '@atlaskit/media-state';

import { defaultArtifactsUris } from './artifactSets';
import type { ItemWithBinaries } from './types';

const getArtifactType = (artifactKey: string) =>
  artifactKey.replace('.', '_').split('_')[0];

const createArtifactUri = (
  mediaType: string,
  artifactKey: string,
  artifactsUri?: Record<string, string>,
) => {
  const artifactType = getArtifactType(artifactKey);

  return (
    artifactsUri?.[artifactKey] ||
    artifactsUri?.[artifactType] ||
    defaultArtifactsUris[mediaType]?.[artifactKey] ||
    defaultArtifactsUris[mediaType]?.[artifactType] ||
    `no-default-uri-for-${mediaType}-${artifactKey}`
  );
};

const setArtifactsUri = (
  mediaType: string,
  artifacts: MediaFileArtifacts,
  artifactsUri?: Record<string, string>,
): MediaFileArtifacts => {
  const artifactsEntries = Object.entries<MediaFileArtifact>({
    ...artifacts, // Spreading to make TS happy
  });
  const processedArtifactEntries = artifactsEntries.map(
    ([key, artifact]): [string, MediaFileArtifact] => [
      key,
      {
        ...artifact,
        url: createArtifactUri(mediaType, key, artifactsUri),
      },
    ],
  );
  return Object.fromEntries(processedArtifactEntries);
};

const setFileItemArtifacts = (
  fileItem: ResponseFileItem,
  artifactsUri?: Record<string, string>,
): ResponseFileItem => {
  const { details } = fileItem;
  const { mediaType, artifacts } = details;
  return {
    ...fileItem,
    details: {
      ...details,
      artifacts: setArtifactsUri(mediaType, artifacts, artifactsUri),
    },
  };
};

export const createItemWithBinaries = (
  fileItem: ResponseFileItem,
  artifactsUri?: Record<string, string>,
): ItemWithBinaries => {
  const { mediaType } = fileItem.details;
  return {
    fileItem: setFileItemArtifacts(fileItem, artifactsUri),
    binaryUri: createArtifactUri(mediaType, 'binaryUri', artifactsUri),
    image: createArtifactUri(mediaType, 'image', artifactsUri),
  };
};
