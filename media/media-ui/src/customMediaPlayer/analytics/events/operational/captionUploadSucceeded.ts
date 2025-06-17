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
} from '../../utils/captionAttributes';

export type CaptionUploadSucceededOperationalEventPayload = OperationalEventPayload<
	OperationalAttributes & WithCaptionAttributes & WithCustomMediaPlayerType & WithTraceContext,
	'uploadSucceeded',
	'mediaPlayerCaption'
>;

export function createCaptionUploadSucceededOperationalEvent(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceId: string,
): CaptionUploadSucceededOperationalEventPayload {
	return {
		eventType: 'operational',
		action: 'uploadSucceeded',
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: fileId,
		attributes: generateBaseAttributes(type, captionAttributes, fileId, traceId),
	};
}
