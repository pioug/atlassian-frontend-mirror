import { Plugin } from 'prosemirror-state';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  DispatchAnalyticsEvent,
} from '../../analytics';
import { EditorView } from 'prosemirror-view';
import {
  isPerformanceObserverAvailable,
  isPerformanceAPIAvailable,
} from '@atlaskit/editor-common';

const FREEZE_CHECK_TIME = 600;
const SLOW_INPUT_TIME = 300;
const DEFAULT_KEYSTROKE_SAMPLING_LIMIT = 100;

const dispatchLongTaskEvent = (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  view: EditorView,
  time: number,
) => {
  const { state } = view;
  return dispatchAnalyticsEvent({
    action: ACTION.BROWSER_FREEZE,
    actionSubject: ACTION_SUBJECT.EDITOR,
    attributes: {
      freezeTime: time,
      nodeSize: state.doc.nodeSize,
    },
    eventType: EVENT_TYPE.OPERATIONAL,
  });
};

export default (
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
  inputSamplingLimit?: number,
) => {
  let keystrokeCount = 0;
  const samplingLimit =
    typeof inputSamplingLimit === 'number'
      ? inputSamplingLimit
      : DEFAULT_KEYSTROKE_SAMPLING_LIMIT;
  return new Plugin({
    props: isPerformanceAPIAvailable()
      ? {
          handleTextInput(view, from: number, to: number, text: string) {
            const { state } = view;
            const now = performance.now();

            requestAnimationFrame(() => {
              const diff = performance.now() - now;
              if (samplingLimit && ++keystrokeCount === samplingLimit) {
                keystrokeCount = 0;
                dispatchAnalyticsEvent({
                  action: ACTION.INPUT_PERF_SAMPLING,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                });
              }

              if (diff > SLOW_INPUT_TIME) {
                dispatchAnalyticsEvent({
                  action: ACTION.SLOW_INPUT,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    time: diff,
                    nodeSize: state.doc.nodeSize,
                  },
                  eventType: EVENT_TYPE.OPERATIONAL,
                });
              }
            });
            return false;
          },
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
            if (duration > FREEZE_CHECK_TIME) {
              dispatchLongTaskEvent(dispatchAnalyticsEvent, view, duration);
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
