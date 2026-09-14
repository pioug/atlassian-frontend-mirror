import {
	type FileAttributes,
	type PerformanceAttributes,
	type MediaTraceContext,
} from '@atlaskit/media-common/analytics';

import type { MediaCardError } from '../../MediaCardError';
import type { RenderFailedEventPayload, SSRStatus } from './analytics';
import { extractErrorInfo } from './extractErrorInfo';
import { getRenderErrorRequestMetadata } from './getRenderErrorRequestMetadata';

export const getRenderErrorEventPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	error: MediaCardError,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): RenderFailedEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaCardRender',
		attributes: {
			fileMimetype: fileAttributes.fileMimetype,
			fileAttributes,
			performanceAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			ssrReliability,
			traceContext,
		},
	};
};
