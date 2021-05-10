import {
  getUnsupportedContentLevelData,
  UnsupportedContentLevelsTracking,
  getAnalyticsAppearance,
} from '@atlaskit/editor-common';

import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from './enums';
import { PLATFORM, AnalyticsEventPayload } from './events';

type DispatchAnalyticsEvent = (event: AnalyticsEventPayload) => void;

type DocumentData = { rendererId: string; doc: any; appearance?: string };

let rendersMap: { [appearance: string]: Set<string> } = {};

type ProcessLevelsAndTrack = (
  item: DocumentData,
  thresholds: UnsupportedContentLevelsTracking['thresholds'],
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
) => void;

const processLevelsAndTrack: ProcessLevelsAndTrack = (
  item,
  thresholds,
  dispatchAnalyticsEvent,
) => {
  try {
    const {
      severity,
      percentage,
      counts: { supportedNodes, unsupportedNodes },
    } = getUnsupportedContentLevelData(item.doc, thresholds);

    dispatchAnalyticsEvent({
      action: ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_SUCCEEDED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      attributes: {
        appearance: getAnalyticsAppearance(item.appearance),
        platform: PLATFORM.WEB,
        unsupportedContentLevelSeverity: severity,
        unsupportedContentLevelPercentage: percentage,
        unsupportedNodesCount: unsupportedNodes,
        supportedNodesCount: supportedNodes,
      },
      eventType: EVENT_TYPE.OPERATIONAL,
    });
  } catch (err) {
    dispatchAnalyticsEvent({
      action: ACTION.UNSUPPORTED_CONTENT_LEVELS_TRACKING_ERRORED,
      actionSubject: ACTION_SUBJECT.RENDERER,
      attributes: {
        platform: PLATFORM.WEB,
        error: err?.toString(),
      },
      eventType: EVENT_TYPE.OPERATIONAL,
    });
  }
};

const schedule = (fn: () => void) => {
  if (typeof (window as any).requestIdleCallback === 'function') {
    (window as any).requestIdleCallback(fn);
  } else {
    setTimeout(fn, 0);
  }
};

const DEFAULT_SAMPLING_RATE = 100;

export const trackUnsupportedContentLevels = (
  item: DocumentData,
  trackingOptions: UnsupportedContentLevelsTracking,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
) => {
  const { thresholds, samplingRates } = trackingOptions;

  const appearance = item.appearance ?? 'unknown';

  if (!rendersMap[appearance]) {
    rendersMap[appearance] = new Set();
  }

  // bail out if already processed a render from a given renderer instance
  const didProcessRenderer = rendersMap[appearance].has(item.rendererId);
  if (didProcessRenderer) {
    return;
  }

  // otherwise track the render
  rendersMap[appearance].add(item.rendererId);

  const sampleRate =
    (samplingRates && samplingRates[appearance]) || DEFAULT_SAMPLING_RATE;

  // sample from the first available tracked render
  if (rendersMap[appearance].size === 1) {
    schedule(() =>
      processLevelsAndTrack(item, thresholds, dispatchAnalyticsEvent),
    );
  }
  // cleanup/refresh tracked renders at the sampling rate
  if (rendersMap[appearance].size % sampleRate === 0) {
    rendersMap[appearance] = new Set();
  }
};
