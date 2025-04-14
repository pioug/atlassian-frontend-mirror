import { withProfiling } from '../self-measurements';

import type { TraceIdContextStateType } from './types';
import { makeTraceHttpRequestHeaders } from './utils/make-trace-http-request-headers';

export type { TraceIdContext } from './types';

const state: TraceIdContextStateType = {
	context: null,
};

export const generateSpanId = withProfiling(function generateSpanId() {
	return Array.from(new Array(16), () => Math.floor(Math.random() * 16).toString(16)).join('');
});

export const setInteractionActiveTrace = withProfiling(function setInteractionActiveTrace(
	interactionId: string,
	experienceType: string,
) {
	setActiveTrace(interactionId.replace(/-/g, ''), generateSpanId(), experienceType);
});

export const setActiveTrace = withProfiling(function setActiveTrace(
	traceId: string,
	spanId: string,
	type: string,
) {
	state.context = {
		traceId,
		spanId,
		type,
	};
});

export const getActiveTrace = withProfiling(function getActiveTrace() {
	return state.context || undefined;
});

export const clearActiveTrace = withProfiling(function clearActiveTrace() {
	state.context = null;
});

export const getActiveTraceHttpRequestHeaders = withProfiling(
	function getActiveTraceHttpRequestHeaders(_url: string) {
		if (state.context === null) {
			return null;
		}

		const { traceId, spanId } = state.context;
		return makeTraceHttpRequestHeaders(traceId, spanId);
	},
);

export const getActiveTraceAsQueryParams = withProfiling(function getActiveTraceAsQueryParams(
	_url: string,
) {
	const traceHeaders = getActiveTraceHttpRequestHeaders(_url);
	return traceHeaders ? new URLSearchParams(traceHeaders).toString().toLowerCase() : null;
});
