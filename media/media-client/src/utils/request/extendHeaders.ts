import { type MediaTraceContext } from '@atlaskit/media-common';
import type { Auth } from '@atlaskit/media-core/auth';

import { ZipkinHeaderKeys } from './helpers';
import { mapAuthToRequestHeaders } from './mapAuthToRequestHeaders';
import { type RequestHeaders } from './types';

const mapTraceIdToRequestHeaders = (traceContext?: Required<MediaTraceContext>) => {
	return traceContext
		? {
				[ZipkinHeaderKeys.traceId]: traceContext.traceId,
				[ZipkinHeaderKeys.spanId]: traceContext.spanId,
			}
		: {};
};

export function extendHeaders(
	headers?: RequestHeaders,
	auth?: Auth,
	traceContext?: Required<MediaTraceContext>,
): RequestHeaders | undefined {
	if (!auth && !traceContext && !headers) {
		return undefined;
	}

	return {
		...(headers ?? {}),
		...mapAuthToRequestHeaders(auth),
		...mapTraceIdToRequestHeaders(traceContext),
	};
}
