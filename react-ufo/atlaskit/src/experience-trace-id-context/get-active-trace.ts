import { context } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { experienceTypeKey } from './experience-type-key';
import { spanIdKey } from './span-id-key';
import { state } from './state';
import { traceIdKey } from './trace-id-key';
import type { TraceIdContext } from './types';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getActiveTrace(): TraceIdContext | undefined {
	if (fg('platform_ufo_enable_otel_context_manager')) {
		// Get trace context from active context
		const activeTraceContext: TraceIdContext = {
			traceId: String(context.active().getValue(traceIdKey)),
			spanId: String(context.active().getValue(spanIdKey)),
			type: String(context.active().getValue(experienceTypeKey)),
		};

		// Return activeTraceContext if traceId and spanId are not "undefined"
		return activeTraceContext.traceId !== 'undefined' && activeTraceContext.spanId !== 'undefined'
			? activeTraceContext
			: undefined;
	} else {
		return state.context || undefined;
	}
}
