import {
	type OperationalAttributes,
	type OperationalEventPayload,
	type WithTraceContext,
} from '@atlaskit/media-common';

import { type CustomMediaPlayerType, type WithCustomMediaPlayerType } from '../../../types';
import {
	type CaptionAttributes,
	type WithCaptionAttributes,
	generateBaseAttributes,
} from '../../utils/captionAttributes';

export type CaptionDeleteSucceededOperationalEventPayload = OperationalEventPayload<
	OperationalAttributes & WithCaptionAttributes & WithCustomMediaPlayerType & WithTraceContext,
	'deleteSucceeded',
	'mediaPlayerCaption'
>;

export function createCaptionDeleteSucceededOperationalEvent(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceId: string,
): CaptionDeleteSucceededOperationalEventPayload {
	return {
		eventType: 'operational',
		action: 'deleteSucceeded',
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: captionAttributes.artifactName,
		attributes: generateBaseAttributes(type, captionAttributes, fileId, traceId),
	};
}
