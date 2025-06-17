import {
	type OperationalEventPayload,
	type OperationalAttributes,
	type WithTraceContext,
} from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	generateBaseAttributes,
	type CaptionAttributes,
	type WithCaptionAttributes,
	type WithErrorAttributes,
} from '../../utils/captionAttributes';

export type CaptionDeleteFailedOperationalEventPayload = OperationalEventPayload<
	OperationalAttributes &
		WithCaptionAttributes &
		WithCustomMediaPlayerType &
		WithTraceContext &
		WithErrorAttributes,
	'deleteFailed',
	'mediaPlayerCaption'
>;

export function createCaptionDeleteFailedOperationalEvent(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceId: string,
	error: Error,
): CaptionDeleteFailedOperationalEventPayload {
	return {
		eventType: 'operational',
		action: 'deleteFailed',
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: captionAttributes.artifactName,
		attributes: {
			...generateBaseAttributes(type, captionAttributes, fileId, traceId),
			failReason: 'delete-fail',
			error: error.name || 'unknown',
			errorDetail: error.message || 'unknown',
		},
	};
}
