import { type MediaTraceContext, getRandomTelemetryId } from '@atlaskit/media-common';

export const extendTraceContext = (
	traceContext?: MediaTraceContext,
): Required<MediaTraceContext> | undefined =>
	traceContext
		? {
				...traceContext,
				spanId: traceContext?.spanId || getRandomTelemetryId(),
			}
		: undefined;
