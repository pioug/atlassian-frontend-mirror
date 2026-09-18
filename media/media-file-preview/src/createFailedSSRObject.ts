import { type MediaTraceContext } from '@atlaskit/media-common';

import type { SSRStatusFail } from './analytics';
import { extractErrorInfo } from './extractErrorInfo';
import { ImageLoadError } from './ImageLoadError';
import { type MediaFilePreview } from './types';

export const createFailedSSRObject = (
	preview: MediaFilePreview,
	metadataTraceContext?: MediaTraceContext,
): SSRStatusFail => ({
	status: 'fail',
	...extractErrorInfo(new ImageLoadError(preview.source), metadataTraceContext),
});
