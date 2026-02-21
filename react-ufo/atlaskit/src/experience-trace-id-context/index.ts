import { type Context, context, createContextKey, ROOT_CONTEXT } from '@opentelemetry/api';

import { fg } from '@atlaskit/platform-feature-flags';

import { getContextManager, UFOContextManager } from './context-manager';
import type { TraceIdContext, TraceIdContextStateType } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

export type { TraceIdContext } from './types';

const state: TraceIdContextStateType = {
	context: null,
};

const traceIdKey = createContextKey('traceId');
const spanIdKey = createContextKey('spanId');
const experienceTypeKey = createContextKey('type');

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
export function generateSpanId(): string {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
}

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
export function setInteractionActiveTrace(interactionId: string, experienceType: string): void {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
}

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
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

// DO NOT CALL THIS FUNCTION DIRECTLY!!!!
// It is only to be called by React UFO libraries for the automatic handling of trace context for experiences.
// Calling this may cause trace context to be broken
export function clearActiveTrace(): void {
	if (fg('platform_ufo_enable_otel_context_manager')) {
		// Now we need to get the global Context Manager and set the active context
		// Using type assertion because we've "extended" the ContextManager type
		if (getContextManager() instanceof UFOContextManager) {
			let contextManager = getContextManager() as UFOContextManager;

			// ROOT_CONTEXT is an empty context used to initialise ContextManagers
			contextManager.setActive(ROOT_CONTEXT);
		}
	} else {
		state.context = null;
	}
}

export function getActiveTraceHttpRequestHeaders(_url?: string): {
	'X-B3-TraceId': string;
	'X-B3-SpanId': string;
} | null {
	if (getActiveTrace() === undefined) {
		return null;
	}

	const { traceId, spanId } = getActiveTrace() as TraceIdContext;
	return makeTraceHttpRequestHeaders(traceId, spanId);
}

export function getActiveTraceAsQueryParams(_url?: string): string | null {
	const traceHeaders = getActiveTraceHttpRequestHeaders();
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
}
