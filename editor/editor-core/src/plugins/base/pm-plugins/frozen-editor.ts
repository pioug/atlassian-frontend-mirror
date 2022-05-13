import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  isPerformanceObserverAvailable,
  isPerformanceAPIAvailable,
  getAnalyticsEventSeverity,
  SEVERITY,
} from '@atlaskit/editor-common/utils';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';
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
import InputLatencyTracker from '../utils/input-latency-tracking';

export const frozenEditorPluginKey = new PluginKey('frozenEditor');

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
  getNodeCount: (state: EditorState) => object,
  interactionType?: BROWSER_FREEZE_INTERACTION_TYPE,
  severity?: SEVERITY,
) => {
  const { state } = view;
  const nodesCount = getNodeCount(state);

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
  ufo?: boolean,
) => {
  let interactionType: BROWSER_FREEZE_INTERACTION_TYPE;
  let inputLatencyTracker: InputLatencyTracker | null = null;

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
  let prevNodeCountState: EditorState | null = null;
  let prevNodeCount: object = {};

  // Cache the result as we were calling this multiple times
  // and has potential to be expensive
  const getNodeCount = (state: EditorState) => {
    if (state === prevNodeCountState) {
      return prevNodeCount;
    }

    prevNodeCount = allowCountNodes ? countNodes(state) : {};
    prevNodeCountState = state;

    return prevNodeCount;
  };

  const shouldTrackSeverity =
    inputTracking?.trackSeverity || DEFAULT_TRACK_SEVERITY_ENABLED;
  const severityThresholdNormal =
    inputTracking?.severityNormalThreshold ||
    DEFAULT_TRACK_SEVERITY_THRESHOLD_NORMAL;
  const severityThresholdDegraded =
    inputTracking?.severityDegradedThreshold ||
    DEFAULT_TRACK_SEVERITY_THRESHOLD_DEGRADED;

  return new SafePlugin({
    key: frozenEditorPluginKey,
    props: isPerformanceAPIAvailable()
      ? {
          handleTextInput(view) {
            inputLatencyTracker?.start();

            if (browserFreezeTracking?.trackInteractionType) {
              interactionType = BROWSER_FREEZE_INTERACTION_TYPE.TYPING;
            }

            requestAnimationFrame(() => {
              inputLatencyTracker?.end();
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

      const experienceStore = ufo
        ? ExperienceStore.getInstance(view)
        : undefined;

      if (inputTracking?.enabled) {
        inputLatencyTracker = new InputLatencyTracker({
          samplingRate,
          slowThreshold,
          normalThreshold: severityThresholdNormal,
          degradedThreshold: severityThresholdDegraded,
          onSampleStart: () => {
            experienceStore?.start(EditorExperience.typing);
          },
          onSampleEnd: (time, { isSlow, severity }) => {
            const { state } = view;
            const nodesCount = getNodeCount(state);

            if (isSlow) {
              experienceStore?.addMetadata(EditorExperience.typing, {
                slowInput: true,
              });
            }

            experienceStore?.success(EditorExperience.typing, {
              nodeSize: state.doc.nodeSize,
              ...nodesCount,
              participants: getParticipantsCount(state),
              objectId: getContextIdentifier(state)?.objectId,
              time,
              severity: shouldTrackSeverity ? severity : undefined,
            });
          },
          dispatchSample: (time, severity) => {
            const { state } = view;
            const nodesCount = getNodeCount(state);

            const samplePayload: AnalyticsEventPayload = {
              action: ACTION.INPUT_PERF_SAMPLING,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                time,
                nodeSize: state.doc.nodeSize,
                ...nodesCount,
                participants: getParticipantsCount(state),
                objectId: getContextIdentifier(state)?.objectId,
                severity: shouldTrackSeverity ? severity : undefined,
              },
              eventType: EVENT_TYPE.OPERATIONAL,
            };

            dispatchAnalyticsEvent(samplePayload);
          },
          dispatchAverage: ({ mean, median, sampleSize }, severity) => {
            const { state } = view;
            const nodeCount = getNodeCount(state);

            const averagePayload: AnalyticsEventPayload = {
              action: ACTION.INPUT_PERF_SAMPLING_AVG,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                mean,
                median,
                sampleSize,
                ...nodeCount,
                nodeSize: state.doc.nodeSize,
                severity: shouldTrackSeverity ? severity : undefined,
                participants: getParticipantsCount(state),
                objectId: getContextIdentifier(state)?.objectId,
              },
              eventType: EVENT_TYPE.OPERATIONAL,
            };

            dispatchAnalyticsEvent(averagePayload);
          },
          onSlowInput: (time) => {
            const { state } = view;
            const nodesCount = getNodeCount(state);

            dispatchAnalyticsEvent({
              action: ACTION.SLOW_INPUT,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                time,
                nodeSize: state.doc.nodeSize,
                ...nodesCount,
                participants: getParticipantsCount(state),
                objectId: getContextIdentifier(state)?.objectId,
              },
              eventType: EVENT_TYPE.OPERATIONAL,
            });
          },
        });
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
                getNodeCount,
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
          inputLatencyTracker?.flush();
          observer?.disconnect();
        },
      };
    },
  });
};
