import React, { createContext, type ReactNode, useContext, useMemo } from 'react';

import type { EnhancedUFOInteractionContextType, ReactProfilerTiming } from '../../common';
import { getConfig } from '../../config';
import { sanitizeLabelStackName } from '../../create-payload/common/utils/sanitize-label-stack-name';
import { getActiveInteraction } from '../../interaction-metrics';

import { clearState } from './clear-state';
import { ProfilerMarker } from './profiler-marker';
import state from './state';
import type { GlobalThis, SpanContext, SpanState } from './types';

function checkActiveInteractionAndResetStartMarksIfSet() {
	const activeInteractionId = getActiveInteraction()?.id;
	if (!!state.lastActiveInteraction && state.lastActiveInteraction !== activeInteractionId) {
		clearState();
	}
	state.lastActiveInteraction = activeInteractionId;
}
const getIsNativeTracingEnabled = () => getConfig()?.ssr?.enableNativeTracing ?? false;

const onStartRender = (
	id: string,
	currentSegmentName: string,
	parentContext: SpanContext | null,
): SpanState | null => {
	if (!state.startTimes.has(id)) {
		state.startTimes.set(id, []);
	}

	state.startTimes.get(id)?.push(performance.now());

	if (!getIsNativeTracingEnabled()) {
		return null;
	}
	const startSpan = (globalThis as GlobalThis).__vm_internals__?.telemetry?.startSpan;

	let spanState = state.spanStates.get(id) ?? null;
	if (!spanState && startSpan) {
		const span = startSpan(currentSegmentName, { parentSpanId: parentContext?.spanId });
		spanState = { span };
		state.spanStates.set(id, spanState);
	}
	return spanState;
};

const ParentSpanContext = createContext<SpanContext | null>(null);

export const SsrRenderProfilerInner = ({
	children,
	labelStack,
	onRender,
}: {
	children?: ReactNode | undefined;
	labelStack: ReactProfilerTiming['labelStack'];
	onRender: EnhancedUFOInteractionContextType['onRender'];
}): React.JSX.Element => {
	const reactProfilerId = useMemo(
		() => labelStack.map((l) => sanitizeLabelStackName(l.name)).join('/'),
		[labelStack],
	);

	checkActiveInteractionAndResetStartMarksIfSet();

	const parentSpan = useContext(ParentSpanContext);
	const currentSpanState = onStartRender(
		reactProfilerId,
		sanitizeLabelStackName(labelStack[labelStack.length - 1].name),
		parentSpan,
	);

	return (
		<>
			<ParentSpanContext.Provider value={currentSpanState?.span.getSpanContext() ?? null}>
				{children}
				<ProfilerMarker
					onRender={() => {
						const startTimesForId = state.startTimes.get(reactProfilerId);
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
						const spanState = state.spanStates.get(reactProfilerId);
						if (spanState) {
							spanState.latestEndTime = performance.now();
						}
					}}
				/>
			</ParentSpanContext.Provider>
		</>
	);
};
