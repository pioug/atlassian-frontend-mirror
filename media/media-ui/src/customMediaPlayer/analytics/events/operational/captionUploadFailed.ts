import {
	type OperationalAttributes,
	type OperationalEventPayload,
	type WithTraceContext,
} from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	generateBaseAttributes,
	type CaptionAttributes,
	type WithCaptionAttributes,
	type WithErrorAttributes,
} from '../../utils/captionAttributes';

export type CaptionUploadFailedOperationalEventPayload = OperationalEventPayload<
	OperationalAttributes &
		WithCaptionAttributes &
		WithCustomMediaPlayerType &
		WithTraceContext &
		WithErrorAttributes,
	'uploadFailed',
	'mediaPlayerCaption'
>;

export function createCaptionUploadFailedOperationalEvent(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceId: string,
	error: Error,
): CaptionUploadFailedOperationalEventPayload {
	return {
		eventType: 'operational',
		action: 'uploadFailed',
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: fileId,
		attributes: {
			...generateBaseAttributes(type, captionAttributes, fileId, traceId),
			failReason: 'upload-fail',
			error: error.name || 'unknown',
			errorDetail: error.message || 'unknown',
		},
	};
}
