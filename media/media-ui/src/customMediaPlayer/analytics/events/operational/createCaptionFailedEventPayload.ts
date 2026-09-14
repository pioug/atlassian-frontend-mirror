import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type {
	CaptionAttributes,
	CaptionFailedEventAction,
	CaptionFailedEventPayload,
	WithErrorAttributes,
} from './captions';
import { generateBaseAttributes } from './generateBaseAttributes';
import { getErrorDetail } from './getErrorDetail';
import { getErrorReason } from './getErrorReason';
import { getErrorRequestMetaData } from './getErrorRequestMetaData';

export function createCaptionFailedEventPayload(
	type: CustomMediaPlayerType,
	action: CaptionFailedEventAction,
	failReason: WithErrorAttributes['failReason'],
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext?: MediaTraceContext,
): CaptionFailedEventPayload {
	return {
		eventType: 'operational',
		action,
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: fileId,
		attributes: {
			...generateBaseAttributes(type, captionAttributes, fileId, traceContext),
			failReason,
			error: getErrorReason(error),
			errorDetail: getErrorDetail(error),
			request: getErrorRequestMetaData(error),
		},
	};
}
