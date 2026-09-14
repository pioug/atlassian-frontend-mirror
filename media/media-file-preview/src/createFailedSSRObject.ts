import { type MediaTraceContext } from '@atlaskit/media-common';

import { ImageLoadError } from './ImageLoadError';
import type { SSRStatusFail } from './analytics';
import { extractErrorInfo } from './extractErrorInfo';
import { type MediaFilePreview } from './types';

export const createFailedSSRObject = (
	preview: MediaFilePreview,
	metadataTraceContext?: MediaTraceContext,
): SSRStatusFail => ({
	status: 'fail',
	...extractErrorInfo(new ImageLoadError(preview.source), metadataTraceContext),
});
