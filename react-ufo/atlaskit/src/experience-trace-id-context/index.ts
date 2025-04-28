import type { TraceIdContextStateType } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

export type { TraceIdContext } from './types';

const state: TraceIdContextStateType = {
	context: null,
};

export function generateSpanId() {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function setInteractionActiveTrace(interactionId: string, experienceType: string) {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
}

export function setActiveTrace(traceId: string, spanId: string, type: string) {
	state.context = {
		traceId,
		spanId,
		type,
	};
}

export function getActiveTrace() {
	return state.context || undefined;
}

export function clearActiveTrace() {
	state.context = null;
}

export function getActiveTraceHttpRequestHeaders(_url: string) {
	if (state.context === null) {
		return null;
	}

	const { traceId, spanId } = state.context;
	return makeTraceHttpRequestHeaders(traceId, spanId);
}

export function getActiveTraceAsQueryParams(_url: string) {
	const traceHeaders = getActiveTraceHttpRequestHeaders(_url);
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
}
