import { type MediaTraceContext } from '@atlaskit/media-common';

import type { CustomMediaPlayerType } from '../../../types';
import type { CaptionAttributes } from './captions';

export function generateBaseAttributes(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId?: string,
	traceContext?: MediaTraceContext,
): {
	traceContext: MediaTraceContext | undefined;
	fileAttributes?:
		| {
				fileId: string;
		  }
		| undefined;
	type: CustomMediaPlayerType;
	captionAttributes: CaptionAttributes;
} {
	return {
		type,
		captionAttributes,
		...(fileId && {
			fileAttributes: {
				fileId,
			},
		}),
		traceContext,
	};
}
