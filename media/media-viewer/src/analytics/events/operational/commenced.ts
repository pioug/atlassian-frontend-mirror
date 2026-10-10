import type {
	MediaTraceContext,
	WithFileAttributes,
	WithTraceContext,
} from '@atlaskit/media-common/analytics/types';

import { type MediaFileEventPayload } from './_mediaFile';

export type CommencedAttributes = WithFileAttributes & WithTraceContext;

export type CommencedEventPayload = MediaFileEventPayload<CommencedAttributes, 'commenced'>;

export const createCommencedEvent = (
	fileId: string,
	traceContext: MediaTraceContext,
): CommencedEventPayload => ({
	eventType: 'operational',
	action: 'commenced',
	actionSubject: 'mediaFile',
	attributes: {
		fileAttributes: {
			fileId: fileId,
		},
		traceContext,
	},
});
