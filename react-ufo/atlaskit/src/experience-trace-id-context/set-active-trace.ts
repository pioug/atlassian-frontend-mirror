import { type Context, ROOT_CONTEXT } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getContextManager, UFOContextManager } from './context-manager';
import { experienceTypeKey } from './experience-type-key';
import { spanIdKey } from './span-id-key';
import { state } from './state';
import { traceIdKey } from './trace-id-key';

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function setActiveTrace(traceId: string, spanId: string, type: string): void {
	if (fg('platform_ufo_enable_otel_context_manager')) {
		const activeTraceContext: Context = ROOT_CONTEXT.setValue(traceIdKey, traceId)
			.setValue(spanIdKey, spanId)
			.setValue(experienceTypeKey, type);

		// Now we need to get the global Context Manager and set the active context
		// Using type assertion because we've "extended" the ContextManager type
		if (getContextManager() instanceof UFOContextManager) {
			let contextManager = getContextManager() as UFOContextManager;

			contextManager.setActive(activeTraceContext);
		}
	} else {
		state.context = {
			traceId,
			spanId,
			type,
		};
	}
}
