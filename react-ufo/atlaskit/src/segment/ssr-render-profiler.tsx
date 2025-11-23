import React, { type ReactNode, useMemo } from 'react';

import type { EnhancedUFOInteractionContextType, ReactProfilerTiming } from '../common';
import { getActiveInteraction } from '../interaction-metrics';

// These are stored outside react context to be resilient to concurrent mode
// restarting the start marker from a suspense and losing the initial render
const startTimes: Map<string, number[]> = new Map();
// Keep track of the last interaction id and reset the start timers if it ever changes.
// This is to allow multi-step ssr to track the render timers from different "interaction"s seperately
let lastActiveInteraction: string | undefined;
function checkActiveInteractionAndResetStartMarksIfSet() {
	const activeInteractionId = getActiveInteraction()?.id;
	if (!!lastActiveInteraction && lastActiveInteraction !== activeInteractionId) {
		startTimes.clear();
	}
	lastActiveInteraction = activeInteractionId;
}
const onStartRender = (id: string) => {
	if (!startTimes.has(id)) {
		startTimes.set(id, []);
	}

	startTimes.get(id)?.push(performance.now());
};

const isInSSR =
	Boolean((globalThis as any)?.__SERVER__) ||
	(typeof process !== 'undefined' && Boolean(process?.env?.REACT_SSR || false));

const ProfilerMarker = ({ onRender }: { onRender?: () => void }) => {
	if (isInSSR) {
		onRender?.();
	}
	return null;
};

export const SsrRenderProfilerInner = ({
	children,
	labelStack,
	onRender,
}: {
	children?: ReactNode | undefined;
	labelStack: ReactProfilerTiming['labelStack'];
	onRender: EnhancedUFOInteractionContextType['onRender'];
}) => {
	const reactProfilerId = useMemo(() => labelStack.map((l) => l.name).join('/'), [labelStack]);

	checkActiveInteractionAndResetStartMarksIfSet();
	return (
		<>
			<ProfilerMarker onRender={() => onStartRender(reactProfilerId)} />
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
				}}
			/>
		</>
	);
};

const SsrRenderProfiler = (props: Parameters<typeof SsrRenderProfilerInner>[0]) => {
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
