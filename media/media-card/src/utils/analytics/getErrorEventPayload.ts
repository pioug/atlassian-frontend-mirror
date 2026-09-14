import { type FileAttributes, type MediaTraceContext } from '@atlaskit/media-common/analytics';

import type { MediaCardError } from '../../MediaCardError';
import { type CardStatus } from '../../types';
import type { ErrorEventPayload, SSRStatus } from './analytics';
import { extractErrorInfo } from './extractErrorInfo';
import { getRenderErrorRequestMetadata } from './getRenderErrorRequestMetadata';

export const getErrorEventPayload = (
	cardStatus: CardStatus,
	fileAttributes: FileAttributes,
	error: MediaCardError,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): ErrorEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'nonCriticalFail',
		actionSubject: 'mediaCardRender',
		attributes: {
			fileAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			ssrReliability,
			traceContext,
			cardStatus,
		},
	};
};
