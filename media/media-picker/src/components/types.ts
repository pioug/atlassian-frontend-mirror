import { type UploadParams } from '../types';
import { type MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';

export interface LocalUploadConfig {
	uploadParams: UploadParams; // This is tenant upload params
	shouldCopyFileToRecents?: boolean;
	featureFlags?: MediaFeatureFlags;
}

export interface DropzoneDragEnterEventPayload {
	length: number;
}

export interface DropzoneDragLeaveEventPayload {
	length: number;
}
