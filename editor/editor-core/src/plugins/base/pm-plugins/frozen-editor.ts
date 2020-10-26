import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import {
  isPerformanceObserverAvailable,
  isPerformanceAPIAvailable,
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
import { InputTracking } from '../../../types/performance-tracking';
const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;
const DEFAULT_SLOW_THRESHOLD = 300;
export const DEFAULT_FREEZE_THRESHOLD = 600;

const dispatchLongTaskEvent = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  view: EditorView,
  time: number,
  allowCountNodes?: boolean,
  interactionType?: BROWSER_FREEZE_INTERACTION_TYPE,
  allowBrowserFreezeInteractionType?: boolean,
) => {
  const { state } = view;

  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: {
      freezeTime: time,
      nodeSize: state.doc.nodeSize,
      nodeCount: allowCountNodes ? countNodes(view.state) : undefined,
      participants: getParticipantsCount(view.state),
      interactionType:
        allowBrowserFreezeInteractionType && interactionType
          ? interactionType
          : undefined,
    },
    eventType: EVENT_TYPE.OPERATIONAL,
  });
};

export const setInteractionType = (
  interactionType: BROWSER_FREEZE_INTERACTION_TYPE = BROWSER_FREEZE_INTERACTION_TYPE.LOADING,
) => interactionType;

export default (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  inputTracking?: InputTracking,
  allowBrowserFreezeInteractionType?: boolean,
) => {
  let keystrokeCount = 0;
  let interactionType: BROWSER_FREEZE_INTERACTION_TYPE;

  if (allowBrowserFreezeInteractionType) {
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
            if (allowBrowserFreezeInteractionType) {
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
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                });
              }
            });
            return false;
          },
          handleDOMEvents: allowBrowserFreezeInteractionType
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
                interactionType,
                allowBrowserFreezeInteractionType,
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
