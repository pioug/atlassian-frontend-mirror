import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type { CaptionAttributes, CaptionFailedEventPayload } from './captions';
import { createCaptionFailedEventPayload } from './createCaptionFailedEventPayload';

export const createCaptionDeleteFailedEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'deleteFailed',
		'delete-fail',
		captionAttributes,
		fileId,
		error,
		traceContext,
	);
