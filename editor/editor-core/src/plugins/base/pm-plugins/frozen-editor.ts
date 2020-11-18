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
} from '../../analytics';
import { getParticipantsCount } from '../../collab-edit/get-participants-count';
import { countNodes } from '../../../utils/count-nodes';
import {
  InputTracking,
  BFreezeTracking,
} from '../../../types/performance-tracking';
import { getContextIdentifier } from './context-identifier';
import { setInteractionType } from '../utils/frozen-editor';
const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
const DEFAULT_SLOW_THRESHOLD = 300;
export const DEFAULT_FREEZE_THRESHOLD = 600;
export const NORMAL_SEVERITY_THRESHOLD = 2000;
export const DEGRADED_SEVERITY_THRESHOLD = 3000;

const dispatchLongTaskEvent = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  view: EditorView,
  time: number,
  allowCountNodes?: boolean,
  interactionType?: BROWSER_FREEZE_INTERACTION_TYPE,
  severity?: SEVERITY,
) => {
  const { state } = view;

  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: {
      objectId: getContextIdentifier(state)?.objectId,
      freezeTime: time,
      nodeSize: state.doc.nodeSize,
      nodeCount: allowCountNodes ? countNodes(view.state) : undefined,
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
  browserFreezeTracking?: BFreezeTracking,
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
              const diff = performance.now() - now;

              if (samplingRate && ++keystrokeCount === samplingRate) {
                keystrokeCount = 0;
                dispatchAnalyticsEvent({
                  action: ACTION.INPUT_PERF_SAMPLING,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                    nodeCount: allowCountNodes
                      ? countNodes(view.state)
                      : undefined,
                    participants: getParticipantsCount(state),
                    objectId: getContextIdentifier(state)?.objectId,
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                });
              }

              if (diff > slowThreshold) {
                dispatchAnalyticsEvent({
                  action: ACTION.SLOW_INPUT,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                    nodeCount: allowCountNodes
                      ? countNodes(view.state)
                      : undefined,
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
        const observer = new PerformanceObserver(list => {
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
                      browserFreezeTracking.severityNormalThreshold,
                      browserFreezeTracking.severityDegradedThreshold,
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
