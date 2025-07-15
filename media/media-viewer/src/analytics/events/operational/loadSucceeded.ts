import {
	type SuccessAttributes,
	type WithFileAttributes,
	type FileAttributes,
	type MediaTraceContext,
	type WithTraceContext,
} from '@atlaskit/media-common';
import { type MediaFileEventPayload } from './_mediaFile';
import { fg } from '@atlaskit/platform-feature-flags';

type WithFeatureFlags = {
	featureFlags: {
		media_document_viewer: boolean;
	};
};

export type LoadSucceededAttributes = SuccessAttributes &
	WithFileAttributes &
	WithTraceContext &
	WithFeatureFlags;

export type LoadSucceededEventPayload = MediaFileEventPayload<
	LoadSucceededAttributes,
	'loadSucceeded'
>;

export const createLoadSucceededEvent = (
	{ fileId, fileMediatype, fileMimetype, fileSize }: FileAttributes,
	traceContext?: MediaTraceContext,
): LoadSucceededEventPayload => {
	return {
		eventType: 'operational',
		actionSubject: 'mediaFile',
		action: 'loadSucceeded',
		attributes: {
			status: 'success',
			fileMediatype,
			fileMimetype,
			fileAttributes: {
				fileId,
				fileMediatype,
				fileMimetype,
				fileSize,
			},
			traceContext: fileMediatype === 'image' ? traceContext : undefined,
			featureFlags: {
				media_document_viewer: fg('media_document_viewer'),
			},
		},
	};
};
