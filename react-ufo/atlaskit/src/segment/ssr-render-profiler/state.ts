import type { SpanState } from './types';

// Shared across profiler renders and the public reset/flush entry points. Keep this
// outside React context so Suspense restarts cannot discard the initial render.
const state: {
	startTimes: Map<string, number[]>;
	spanStates: Map<string, SpanState>;
	lastActiveInteraction: string | undefined;
} = {
	startTimes: new Map(),
	spanStates: new Map(),
	lastActiveInteraction: undefined,
};

export default state;
