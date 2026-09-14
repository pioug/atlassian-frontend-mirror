import {
	type FileAttributes,
	type PerformanceAttributes,
	type MediaTraceContext,
} from '@atlaskit/media-common/analytics';
import type { ProcessingFailReason } from '@atlaskit/media-state/file-state';

import type { RenderFailedEventPayload, SSRStatus } from './analytics';

export const getRenderFailedFileStatusPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
	processingFailReason?: ProcessingFailReason,
): RenderFailedEventPayload => ({
	eventType: 'operational',
	action: 'failed',
	actionSubject: 'mediaCardRender',
	attributes: {
		fileMimetype: fileAttributes.fileMimetype,
		fileAttributes,
		performanceAttributes,
		status: 'fail',
		failReason: 'failed-processing',
		// 'not-available' is used for cases before processingFailReason implementation (backward compatibility)
		processingFailReason: processingFailReason || 'not-available',
		ssrReliability,
		traceContext,
		metadataTraceContext,
	},
});
