import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';
import { getRandomTelemetryId } from '@atlaskit/media-common/helpers';

export const extendTraceContext = (
	traceContext?: MediaTraceContext,
): Required<MediaTraceContext> | undefined =>
	traceContext
		? {
				...traceContext,
				spanId: traceContext?.spanId || getRandomTelemetryId(),
			}
		: undefined;
