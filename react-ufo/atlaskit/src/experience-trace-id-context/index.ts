import type { TraceIdContextStateType } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

export type { TraceIdContext } from './types';

const state: TraceIdContextStateType = {
	context: null,
};

export const generateSpanId = () => {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
};

export const setInteractionActiveTrace = (interactionId: string, experienceType: string) => {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
};

export const setActiveTrace = (traceId: string, spanId: string, type: string) => {
	state.context = {
		traceId,
		spanId,
		type,
	};
};

export const getActiveTrace = () => state.context || undefined;

export const clearActiveTrace = () => {
	state.context = null;
};

export const getActiveTraceHttpRequestHeaders = (_url: string) => {
	if (state.context === null) {
		return null;
	}

	const { traceId, spanId } = state.context;
	return makeTraceHttpRequestHeaders(traceId, spanId);
};

export const getActiveTraceAsQueryParams = (_url: string) => {
	const traceHeaders = getActiveTraceHttpRequestHeaders(_url);
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
};
