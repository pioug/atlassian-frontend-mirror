export interface SpanContext {
	/** 16-character hex string representing the span ID */
	readonly spanId: string;

	/** 32-character hex string representing the trace ID */
	readonly traceId: string;

	/** Whether this span context is sampled */
	readonly isSampled: boolean;

	/** Whether this span context is from a remote service */
	readonly isRemote: boolean;
}
interface SpanOptions {
	/**
	 * Optional parent span ID for explicit parent specification.
	 * If not provided, the span will use the root span as its parent.
	 **/
	parentSpanId?: string;

	/** Optional start time - MUST BE a performance.now() timsestamp */
	startTime?: number;

	/** Optional attributes to set on the span at creation time */
	attributes?: Record<string, string | number | boolean>;

	/** Override the parent's sampled parameter. Generally should only be used to silence noisy spans and their children.
	 * Be VERY careful not to cause performance issues if setting to true */
	sampledOverride?: boolean;
}
export interface Span {
	/** End the span, optionally with a custom end time in milliseconds since epoch */
	end(endTime?: number): void;

	/** Set an attribute on the span */
	setAttribute(key: string, value: string | number | boolean): void;

	/** Add an event to the span */
	addEvent(name: string): void;

	/** Get the span context containing span ID, trace ID, and flags */
	getSpanContext(): SpanContext | null;
}
export type TesseractTelemetryAPI = {
	/**
	 * Start a new span with OpenTelemetry-like API
	 * Unlike typical openTelemetry, the parent span is not automatically inferred from context.
	 * You must explicitly provide a parentSpanId in options if desired.
	 * Otherwise, the span will use the root as its parent.
	 **/
	startSpan(name: string, options?: SpanOptions): Span;

	forceFlush(): void;
};
export type SnapVmInternals = { telemetry?: TesseractTelemetryAPI };
export type GlobalThis = { __vm_internals__?: SnapVmInternals };

export type SpanState = { span: Span; latestEndTime?: number };
