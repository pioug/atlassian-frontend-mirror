import { type UploadParams } from '../types';
import { type MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

export interface LocalUploadConfig {
	uploadParams: UploadParams; // This is tenant upload params
	shouldCopyFileToRecents?: boolean;
	featureFlags?: MediaFeatureFlags;
	/**
	 * When set alongside the `platform_media_picker_upload_batching` feature flag,
	 * files are uploaded in sequential batches of this size — each batch fully
	 * completes before the next one starts. This prevents consumers (e.g. Jira BE)
	 * from being overwhelmed by concurrent credential requests during bulk uploads.
	 */
	uploadBatchSize?: number;
	/**
	 * Delay in milliseconds to wait between sequential upload batches.
	 * Only applies when `uploadBatchSize` is set and the batching feature flag is enabled.
	 * Defaults to 0 (no delay). A value like 1000 gives the backend a 1s cooldown between batches.
	 */
	uploadBatchDelayMs?: number;
}

export interface DropzoneDragEnterEventPayload {
	length: number;
}

export interface DropzoneDragLeaveEventPayload {
	length: number;
}
