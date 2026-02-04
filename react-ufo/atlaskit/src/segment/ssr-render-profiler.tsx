import React, { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { EnhancedUFOInteractionContextType, ReactProfilerTiming } from '../common';
import { getConfig } from '../config';
import { getActiveInteraction } from '../interaction-metrics';

type SpanState = { span: Span; latestEndTime?: number };

// These are stored outside react context to be resilient to concurrent mode
// restarting the start marker from a suspense and losing the initial render
const startTimes: Map<string, number[]> = new Map();
const spanStates: Map<string, SpanState> = new Map();
export const clearState = (): void => {
	startTimes.clear();
	spanStates.clear();
};
// Keep track of the last interaction id and reset the start timers if it ever changes.
// This is to allow multi-step ssr to track the render timers from different "interaction"s seperately
let lastActiveInteraction: string | undefined;
function checkActiveInteractionAndResetStartMarksIfSet() {
	const activeInteractionId = getActiveInteraction()?.id;
	if (!!lastActiveInteraction && lastActiveInteraction !== activeInteractionId) {
		clearState();
	}
	lastActiveInteraction = activeInteractionId;
}
const getIsNativeTracingEnabled = () => getConfig()?.ssr?.enableNativeTracing ?? false;

const onStartRender = (
	id: string,
	currentSegmentName: string,
	parentContext: SpanContext | null,
): SpanState | null => {
	if (!startTimes.has(id)) {
		startTimes.set(id, []);
	}

	startTimes.get(id)?.push(performance.now());

	if (!getIsNativeTracingEnabled()) {
		return null;
	}
	const startSpan = (globalThis as GlobalThis).__vm_internals__?.telemetry?.startSpan;

	let spanState = spanStates.get(id) ?? null;
	if (!spanState && startSpan) {
		const span = startSpan(currentSegmentName, { parentSpanId: parentContext?.spanId });
		spanState = { span };
		spanStates.set(id, spanState);
	}
	return spanState;
};

declare const __SERVER__: boolean | undefined;
const isInSSR =
	(typeof __SERVER__ !== 'undefined' && __SERVER__) ||
	(typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false));

const ProfilerMarker = ({ onRender }: { onRender?: () => void }) => {
	onRender?.();
	return null;
};

const ParentSpanContext = createContext<SpanContext | null>(null);

// For profiler spans in SSR, we 'end' any with their latest end times set, we need to do this at UFO-interaction-end since until then the component could rerender/remount again and spans fundamentally don't use the last 'end' but the first
export const flushSsrRenderProfilerTraces = (): void => {
	spanStates.forEach((spanState) => {
		if (spanState.latestEndTime != null) {
			spanState.span.end(spanState.latestEndTime);
		}
	});
	spanStates.clear();
};

export const SsrRenderProfilerInner = ({
	children,
	labelStack,
	onRender,
}: {
	children?: ReactNode | undefined;
	labelStack: ReactProfilerTiming['labelStack'];
	onRender: EnhancedUFOInteractionContextType['onRender'];
}): React.JSX.Element => {
	const reactProfilerId = useMemo(() => labelStack.map((l) => l.name).join('/'), [labelStack]);

	checkActiveInteractionAndResetStartMarksIfSet();

	const parentSpan = useContext(ParentSpanContext);
	const currentSpanState = onStartRender(
		reactProfilerId,
		labelStack[labelStack.length - 1].name,
		parentSpan,
	);

	return (
		<>
			<ParentSpanContext.Provider value={currentSpanState?.span.getSpanContext() ?? null}>
				{children}
				<ProfilerMarker
					onRender={() => {
						const startTimesForId = startTimes.get(reactProfilerId);
						if (startTimesForId?.length) {
							const endTime = performance.now();
							const firstStartTime = startTimesForId[0];
							const lastStartTime = startTimesForId[startTimesForId.length - 1];
							const baseDuration = endTime - lastStartTime;
							const actualDuration = endTime - firstStartTime;
							onRender(
								'mount', // this is incorrect, but on the server there is no mount phase
								actualDuration,
								baseDuration,
								firstStartTime,
								endTime,
							);
						}
						const spanState = spanStates.get(reactProfilerId);
						if (spanState) {
							spanState.latestEndTime = performance.now();
						}
					}}
				/>
			</ParentSpanContext.Provider>
		</>
	);
};

const SsrRenderProfiler = (props: Parameters<typeof SsrRenderProfilerInner>[0]): React.JSX.Element => {
	if (isInSSR) {
		return <SsrRenderProfilerInner {...props} />;
	}

	// ensure structure similar to SSR implementation
	return (
		<>
			<ProfilerMarker />
			{props.children}
		</>
	);
};
export default SsrRenderProfiler;

interface SpanContext {
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
