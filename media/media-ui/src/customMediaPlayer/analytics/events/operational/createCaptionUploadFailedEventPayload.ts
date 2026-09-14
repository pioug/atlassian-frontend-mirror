import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type { CaptionAttributes, CaptionFailedEventPayload } from './captions';
import { createCaptionFailedEventPayload } from './createCaptionFailedEventPayload';

export const createCaptionUploadFailedEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'uploadFailed',
		'upload-fail',
		captionAttributes,
		fileId,
		error,
		traceContext,
	);
