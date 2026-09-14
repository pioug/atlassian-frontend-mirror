import { type MediaTraceContext } from '@atlaskit/media-common/analytics';

import type { MediaCardError } from '../../MediaCardError';
import type { MediaCardErrorInfo } from './analytics';
import { getErrorTraceContext } from './getErrorTraceContext';
import { getRenderErrorErrorDetail } from './getRenderErrorErrorDetail';
import { getRenderErrorErrorReason } from './getRenderErrorErrorReason';
import { getRenderErrorFailReason } from './getRenderErrorFailReason';

export const extractErrorInfo = (
	error: MediaCardError,
	metadataTraceContext?: MediaTraceContext,
): MediaCardErrorInfo => {
	return {
		failReason: getRenderErrorFailReason(error),
		error: getRenderErrorErrorReason(error),
		errorDetail: getRenderErrorErrorDetail(error),
		metadataTraceContext: metadataTraceContext ?? getErrorTraceContext(error),
	};
};
