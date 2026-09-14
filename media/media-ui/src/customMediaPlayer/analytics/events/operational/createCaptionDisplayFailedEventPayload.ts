import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type { CaptionAttributes, CaptionFailedEventPayload, WithErrorAttributes } from './captions';
import { createCaptionFailedEventPayload } from './createCaptionFailedEventPayload';

export const createCaptionDisplayFailedEventPayload = (
	type: CustomMediaPlayerType,
	failReason: WithErrorAttributes['failReason'],
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext?: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'displayFailed',
		failReason,
		captionAttributes,
		fileId,
		error,
		traceContext,
	);
