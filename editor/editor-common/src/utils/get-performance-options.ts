import type { EditorState, PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ACTION, ACTION_SUBJECT, type AnalyticsEventPayload, EVENT_TYPE } from '../analytics';
import { startMeasure, stopMeasure } from '../performance-measures';

// This was existing logic when converting from ReactNodeView
// our current sampling for this event is not bound by node.type
let nodeViewRenderedEventsCounter = 0;

const DEFAULT_SAMPLING_RATE = 100;
const DEFAULT_SLOW_THRESHOLD = 7;

export function getPerformanceOptions(view: EditorView): {
	trackingEnabled: boolean;
	samplingRate: number;
	slowThreshold: number;
} {
	// Please, do not copy or use this kind of code below
	// @ts-ignore
	const fakePluginKey = {
		key: 'analyticsPlugin$',
		getState: (state: EditorState) => {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return (state as any)['analyticsPlugin$'];
		},
	} as PluginKey;

	const pluginState = fakePluginKey.getState(view.state);

	const nodeViewTracking =
		pluginState && pluginState.performanceTracking
			? pluginState.performanceTracking.nodeViewTracking || {}
			: {};

	const samplingRate = nodeViewTracking.samplingRate ?? DEFAULT_SAMPLING_RATE;
	const slowThreshold = nodeViewTracking.slowThreshold ?? DEFAULT_SLOW_THRESHOLD;

	return {
		trackingEnabled: !!nodeViewTracking.enabled,
		samplingRate,
		slowThreshold,
	};
}

export function startMeasureReactNodeViewRendered({ nodeTypeName }: { nodeTypeName: string }) {
	startMeasure(`🦉${nodeTypeName}::ReactNodeView`);
}

export function stopMeasureReactNodeViewRendered({
	nodeTypeName,
	dispatchAnalyticsEvent,
	samplingRate,
	slowThreshold,
}: {
	nodeTypeName: string;
	dispatchAnalyticsEvent(payload: AnalyticsEventPayload): void;
	// NOTE: the use of sampling rate with a global nodeView counter
	// means that will be unequal weighting given to nodes which are
	// tracked.
	samplingRate: number;
	// NOTE: the slow threshold means any percentile analysis of event
	// durations is limited.
	slowThreshold: number;
}) {
	stopMeasure(`🦉${nodeTypeName}::ReactNodeView`, (duration) => {
		if (++nodeViewRenderedEventsCounter % samplingRate === 0 && duration > slowThreshold) {
			dispatchAnalyticsEvent({
				action: ACTION.REACT_NODEVIEW_RENDERED,
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.OPERATIONAL,
				attributes: {
					node: nodeTypeName,
					duration,
				},
			});
		}
	});
}
