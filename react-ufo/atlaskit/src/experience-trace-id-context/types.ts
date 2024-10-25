export type TraceIdContext = {
	traceId: string;
	spanId: string;
	// We choose to not include the sampled field as we make the sampling decision in the backend
	type: string;
};

export type TraceIdContextStateType = {
	context: TraceIdContext | null;
};
