import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type {
	CaptionAttributes,
	CaptionSucceededEventAction,
	CaptionSucceededEventPayload,
} from './captions';
import { generateBaseAttributes } from './generateBaseAttributes';

export function createCaptionSucceededEventPayload(
	type: CustomMediaPlayerType,
	action: CaptionSucceededEventAction,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext?: MediaTraceContext,
): CaptionSucceededEventPayload {
	return {
		eventType: 'operational',
		action,
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: captionAttributes.artifactName,
		attributes: generateBaseAttributes(type, captionAttributes, fileId, traceContext),
	};
}
