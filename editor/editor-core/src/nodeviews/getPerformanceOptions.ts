import type { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';

import { getParticipantsCount } from '../plugins/collab-edit/get-participants-count';
import { analyticsPluginKey } from '../plugins/analytics/plugin-key';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  AnalyticsEventPayload,
} from '../plugins/analytics';

// This was existing logic when converting from ReactNodeView
// our current sampling for this event is not bound by node.type
export let nodeViewRenderedEventsCounter = 0;

const DEFAULT_SAMPLING_RATE = 100;
const DEFAULT_SLOW_THRESHOLD = 7;

export function getPerformanceOptions(
  view: EditorView,
): {
  trackingEnabled: boolean;
  samplingRate: number;
  slowThreshold: number;
} {
  const pluginState = analyticsPluginKey.getState(view.state);

  const nodeViewTracking =
    pluginState && pluginState.performanceTracking
      ? pluginState.performanceTracking.nodeViewTracking || {}
      : {};

  const samplingRate = nodeViewTracking.samplingRate || DEFAULT_SAMPLING_RATE;
  const slowThreshold =
    nodeViewTracking.slowThreshold || DEFAULT_SLOW_THRESHOLD;

  return {
    trackingEnabled: !!nodeViewTracking.enabled,
    samplingRate,
    slowThreshold,
  };
}

export function startMeasureReactNodeViewRendered({
  nodeTypeName,
}: {
  nodeTypeName: string;
}) {
  startMeasure(`🦉${nodeTypeName}::ReactNodeView`);
}

export function stopMeasureReactNodeViewRendered({
  nodeTypeName,
  dispatchAnalyticsEvent,
  editorState,
  samplingRate,
  slowThreshold,
}: {
  nodeTypeName: string;
  dispatchAnalyticsEvent(payload: AnalyticsEventPayload): void;
  editorState: EditorState;
  // NOTE: the use of sampling rate with a global nodeView counter
  // means that will be unequal weighting given to nodes which are
  // tracked.
  samplingRate: number;
  // NOTE: the slow threshold means any percentile analysis of event
  // durations is limited.
  slowThreshold: number;
}) {
  stopMeasure(`🦉${nodeTypeName}::ReactNodeView`, (duration) => {
    if (
      ++nodeViewRenderedEventsCounter % samplingRate === 0 &&
      duration > slowThreshold
    ) {
      dispatchAnalyticsEvent({
        action: ACTION.REACT_NODEVIEW_RENDERED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          node: nodeTypeName,
          duration,
          participants: getParticipantsCount(editorState),
        },
      });
    }
  });
}
