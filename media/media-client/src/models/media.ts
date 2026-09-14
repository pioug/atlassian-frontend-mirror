/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type MediaTraceContext, type MediaType } from '@atlaskit/media-common';
import type { MediaFileArtifacts, ProcessingFailReason } from '@atlaskit/media-state/file-state';

// Warning! You can't add new media file processing status!
// See packages/media/media-core/src/__tests__/cache-backward-compatibility.spec.ts
export type MediaFileProcessingStatus = 'pending' | 'succeeded' | 'failed';

export type { MediaType } from '@atlaskit/media-common';

export type AbuseClassification = {
	classification: 'ABHORRENT' | 'MALICIOUS' | 'ILLICIT' | 'COPYRIGHT';
	confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'SYNTHETIC';
};

export type FileMediaMetadata = {
	duration?: number;
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
	readonly hash?: string;
	readonly metadataTraceContext?: MediaTraceContext;
	readonly abuseClassification?: AbuseClassification;
	readonly mediaMetadata?: FileMediaMetadata;
	readonly failReason?: ProcessingFailReason;
	readonly previewCdnUrl?: string;
};

export type MediaItemDetails = {
	readonly mediaType: MediaType;
	readonly mimeType: string;
	readonly name: string;
	readonly processingStatus: MediaFileProcessingStatus;
	readonly size: number;
	readonly artifacts: MediaFileArtifacts;
	readonly representations: MediaRepresentations;
	readonly createdAt?: number;
	readonly hash?: string;
	readonly metadataTraceContext?: MediaTraceContext;
	readonly abuseClassification?: AbuseClassification;
	readonly mediaMetadata?: FileMediaMetadata;
	readonly failReason?: ProcessingFailReason;
	readonly previewCdnUrl?: string;
};

export type NotFoundMediaItemDetails = {
	readonly id: string;
	readonly collection?: string;
	readonly type: 'not-found';
	readonly metadataTraceContext?: MediaTraceContext;
};

export type MediaRepresentations = {
	image?: object;
};

export type MediaUpload = {
	readonly id: string;
	readonly created: number;
	readonly expires: number;
};

export enum DATA_UNIT {
	MB = 1024 * 1024,
	GB = 1024 * MB,
	TB = 1024 * GB,
}

/**
 * @deprecated Use `import { isPreviewableType } from '@atlaskit/media-client'` instead.
 */
export { isPreviewableType } from './is-previewable-type';
/**
 * @deprecated Use `import { isNotFoundMediaItemDetails } from '@atlaskit/media-client/media'` instead.
 */
export { isNotFoundMediaItemDetails } from './is-not-found-media-item-details';
