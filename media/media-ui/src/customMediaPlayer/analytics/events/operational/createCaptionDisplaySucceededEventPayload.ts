import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type { CaptionAttributes, CaptionSucceededEventPayload } from './captions';
import { createCaptionSucceededEventPayload } from './createCaptionSucceededEventPayload';

export const createCaptionDisplaySucceededEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext?: MediaTraceContext,
): CaptionSucceededEventPayload =>
	createCaptionSucceededEventPayload(
		type,
		'displaySucceeded',
		captionAttributes,
		fileId,
		traceContext,
	);
