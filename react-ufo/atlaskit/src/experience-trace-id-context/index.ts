import type { TraceIdContext, TraceIdContextStateType } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

export type { TraceIdContext } from './types';

const state: TraceIdContextStateType = {
	context: null,
};

export function generateSpanId(): string {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function setInteractionActiveTrace(interactionId: string, experienceType: string): void {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
}

export function setActiveTrace(traceId: string, spanId: string, type: string): void {
	state.context = {
		traceId,
		spanId,
		type,
	};
}

export function getActiveTrace(): TraceIdContext | undefined {
	return state.context || undefined;
}

export function clearActiveTrace(): void {
	state.context = null;
}

export function getActiveTraceHttpRequestHeaders(_url?: string): {
	'X-B3-TraceId': string;
	'X-B3-SpanId': string;
} | null {
	if (state.context === null) {
		return null;
	}

	const { traceId, spanId } = state.context;
	return makeTraceHttpRequestHeaders(traceId, spanId);
}

export function getActiveTraceAsQueryParams(_url?: string): string | null {
	const traceHeaders = getActiveTraceHttpRequestHeaders();
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
}
