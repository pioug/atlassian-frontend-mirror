import {
	type FileAttributes,
	type PerformanceAttributes,
	type MediaTraceContext,
} from '@atlaskit/media-common/analytics';

import type { RenderSucceededEventPayload, SSRStatus } from './analytics';

export const getRenderSucceededEventPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
	samplingRate?: number,
): RenderSucceededEventPayload => {
	const isSamplingEnabled = samplingRate !== undefined && samplingRate < 1;
	return {
		eventType: 'operational',
		action: 'succeeded',
		actionSubject: 'mediaCardRender',
		attributes: {
			fileMimetype: fileAttributes.fileMimetype,
			fileAttributes,
			performanceAttributes,
			status: 'success',
			ssrReliability,
			traceContext,
			metadataTraceContext,
			...(isSamplingEnabled && { isSamplingEnabled }),
			...(samplingRate !== undefined && { samplingRate }),
		},
	};
};
