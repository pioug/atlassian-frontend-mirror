import {
  getMediaFeatureFlag,
  MediaFeatureFlags,
  MediaType,
} from '@atlaskit/media-common';

import type { MediaFileArtifacts } from './artifacts';

// Warning! You can't add new media file processing status!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaFileProcessingStatus = 'pending' | 'succeeded' | 'failed';

export type { MediaType } from '@atlaskit/media-common';

export const isPreviewableType = (
  type: MediaType,
  featureFlags?: MediaFeatureFlags,
): boolean => {
  // in classic experience, only audio/video/image are previewable
  const defaultPreviewableTypes = ['audio', 'video', 'image'];

  // in the new experience, docs are previewable too
  if (getMediaFeatureFlag('newCardExperience', featureFlags)) {
    return [...defaultPreviewableTypes, 'doc'].indexOf(type) > -1;
  }

  return defaultPreviewableTypes.indexOf(type) > -1;
};

export type MediaFile = {
  readonly id: string;
  readonly mediaType: MediaType;
  readonly mimeType: string;
  readonly name: string;
  readonly processingStatus?: MediaFileProcessingStatus;
  readonly size: number;
  readonly artifacts: MediaFileArtifacts;
  readonly representations: MediaRepresentations;
  readonly createdAt?: number;
};

export type MediaCollection = {
  readonly name: string;
  readonly createdAt: number;
};

export type MediaCollectionItems = {
  readonly contents: MediaCollectionItem[];
  readonly nextInclusiveStartKey?: string;
};

export type MediaCollectionItem = {
  readonly id: string;
  readonly insertedAt: number;
  readonly occurrenceKey: string;
  readonly details: MediaCollectionItemDetails;
};

export type MediaCollectionItemMinimalDetails = {
  readonly name: string;
  readonly size: number;
};

export type MediaCollectionItemFullDetails = {
  readonly mediaType: MediaType;
  readonly mimeType: string;
  readonly name: string;
  readonly processingStatus: MediaFileProcessingStatus;
  readonly size: number;
  readonly artifacts: MediaFileArtifacts;
  readonly representations: MediaRepresentations;
  readonly createdAt?: number;
};

export type MediaRepresentations = {
  image?: Object;
};

export type MediaCollectionItemDetails =
  | MediaCollectionItemMinimalDetails
  | MediaCollectionItemFullDetails;

export const isMediaCollectionItemFullDetails = (
  mediaCollectionItem: MediaCollectionItemDetails,
): mediaCollectionItem is MediaCollectionItemFullDetails =>
  !!(mediaCollectionItem as any)['mediaType'] &&
  !!(mediaCollectionItem as any)['mimeType'] &&
  !!(mediaCollectionItem as any)['processingStatus'];

export type MediaUpload = {
  readonly id: string;
  readonly created: number;
  readonly expires: number;
};

export type MediaChunksProbe = {
  readonly results: {
    readonly [etag: string]: {
      readonly exists: boolean;
    };
  };
};
