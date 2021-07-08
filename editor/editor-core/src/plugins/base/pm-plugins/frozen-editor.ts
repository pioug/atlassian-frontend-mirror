import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  isPerformanceObserverAvailable,
  isPerformanceAPIAvailable,
  getAnalyticsEventSeverity,
  SEVERITY,
} from '@atlaskit/editor-common';
import {
  ACTION,
  ACTION_SUBJECT,
  BROWSER_FREEZE_INTERACTION_TYPE,
  EVENT_TYPE,
  DispatchAnalyticsEvent,
  AnalyticsEventPayload,
} from '../../analytics';
import { getParticipantsCount } from '../../collab-edit/get-participants-count';
import { countNodes } from '../../../utils/count-nodes';
import {
  InputTracking,
  BrowserFreezetracking,
} from '../../../types/performance-tracking';
import { getContextIdentifier } from './context-identifier';
import { setInteractionType } from '../utils/frozen-editor';
import { getTimeSince } from '../../../utils/performance/get-performance-timing';

const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
const DEFAULT_SLOW_THRESHOLD = 300;
export const DEFAULT_FREEZE_THRESHOLD = 600;
export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;
const DEFAULT_TRACK_SEVERITY_ENABLED = false;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL = 100;
export const DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED = 500;

const dispatchLongTaskEvent = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  view: EditorView,
  time: number,
  allowCountNodes?: boolean,
  interactionType?: BROWSER_FREEZE_INTERACTION_TYPE,
  severity?: SEVERITY,
) => {
  const { state } = view;

  const nodesCount = allowCountNodes ? countNodes(view.state) : {};

  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: {
      objectId: getContextIdentifier(state)?.objectId,
      freezeTime: time,
      nodeSize: state.doc.nodeSize,
      ...nodesCount,
      participants: getParticipantsCount(view.state),
      interactionType,
      severity,
    },
    eventType: EVENT_TYPE.OPERATIONAL,
  });
};

export default (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  inputTracking?: InputTracking,
  browserFreezeTracking?: BrowserFreezetracking,
) => {
  let keystrokeCount = 0;
  let interactionType: BROWSER_FREEZE_INTERACTION_TYPE;

  if (browserFreezeTracking?.trackInteractionType) {
    interactionType = setInteractionType(
      BROWSER_FREEZE_INTERACTION_TYPE.LOADING,
    );
  }

  const samplingRate =
    inputTracking && typeof inputTracking.samplingRate === 'number'
      ? inputTracking.samplingRate
      : DEFAULT_KEYSTROKE_SAMPLING_LIMIT;

  const slowThreshold =
    inputTracking && typeof inputTracking.slowThreshold === 'number'
      ? inputTracking.slowThreshold
      : DEFAULT_SLOW_THRESHOLD;

  const freezeThreshold =
    inputTracking && typeof inputTracking.freezeThreshold === 'number'
      ? inputTracking.freezeThreshold
      : DEFAULT_FREEZE_THRESHOLD;

  const allowCountNodes = inputTracking && inputTracking.countNodes;

  const shouldTrackSeverity =
    inputTracking?.trackSeverity || DEFAULT_TRACK_SEVERITY_ENABLED;
  const severityThresholdNormal =
    inputTracking?.severityNormalThreshold ||
    DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
  const severityThresholdDegraded =
    inputTracking?.severityDegradedThreshold ||
    DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;

  return new Plugin({
    props: isPerformanceAPIAvailable()
      ? {
          handleTextInput(view) {
            const { state } = view;
            const now = performance.now();
            if (browserFreezeTracking?.trackInteractionType) {
              interactionType = BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
            }

            requestAnimationFrame(() => {
              const diff = getTimeSince(now);

              if (samplingRate && ++keystrokeCount === samplingRate) {
                const nodesCount = allowCountNodes
                  ? countNodes(view.state)
                  : {};
                keystrokeCount = 0;

                const payload: AnalyticsEventPayload = {
                  action: ACTION.INPUT_PERF_SAMPLING,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                    ...nodesCount,
                    participants: getParticipantsCount(state),
                    objectId: getContextIdentifier(state)?.objectId,
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                };

                if (shouldTrackSeverity) {
                  payload.attributes!.severity = getAnalyticsEventSeverity(
                    diff,
                    severityThresholdNormal,
                    severityThresholdDegraded,
                  );
                }

                dispatchAnalyticsEvent(payload);
              }

              if (diff > slowThreshold) {
                const nodesCount = allowCountNodes
                  ? countNodes(view.state)
                  : {};

                dispatchAnalyticsEvent({
                  action: ACTION.SLOW_INPUT,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                    ...nodesCount,
                    participants: getParticipantsCount(state),
                    objectId: getContextIdentifier(state)?.objectId,
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                });
              }
            });
            return false;
          },
          handleDOMEvents: browserFreezeTracking?.trackInteractionType
            ? {
                click: () => {
                  interactionType = setInteractionType(
                    BROWSER_FREEZE_INTERACTION_TYPE.CLICKING,
                  );
                  return false;
                },
                paste: () => {
                  interactionType = setInteractionType(
                    BROWSER_FREEZE_INTERACTION_TYPE.PASTING,
                  );
                  return false;
                },
              }
            : undefined,
        }
      : undefined,
    view(view) {
      if (!isPerformanceObserverAvailable()) {
        return {};
      }
      let observer: PerformanceObserver | undefined;
      try {
        const observer = new PerformanceObserver((list) => {
          const perfEntries = list.getEntries();
          for (let i = 0; i < perfEntries.length; i++) {
            const { duration } = perfEntries[i];
            if (duration > freezeThreshold) {
              dispatchLongTaskEvent(
                dispatchAnalyticsEvent,
                view,
                duration,
                allowCountNodes,
                browserFreezeTracking?.trackInteractionType
                  ? interactionType
                  : undefined,
                browserFreezeTracking?.trackSeverity
                  ? getAnalyticsEventSeverity(
                      duration,
                      browserFreezeTracking.severityNormalThreshold ||
                        NORMAL_SEVERITY_THRESHOLD,
                      browserFreezeTracking.severityDegradedThreshold ||
                        DEGRADED_SEVERITY_THRESHOLD,
                    )
                  : undefined,
              );
            }
          }
        });

        // register observer for long task notifications
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {}

      return {
        destroy: () => {
          if (observer) {
            observer.disconnect();
          }
        },
      };
    },
  });
};
