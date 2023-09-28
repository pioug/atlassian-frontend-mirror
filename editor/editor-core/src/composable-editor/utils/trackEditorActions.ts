import type { FireAnalyticsCallback } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';

import type EditorActions from '../../actions';
import type { PerformanceTracking } from '../../types/performance-tracking';

/**
 *
 * Util function to be used with the Editor to track the EditorActions prop
 *
 * @param editorActions
 * @param performanceTracking
 * @param handleAnalyticsEvent
 * @returns
 */
export default function trackEditorActions(
  editorActions: EditorActions & {
    _contentRetrievalTracking?: {
      getValueTracked: boolean;
      samplingCounters: { success: number; failure: number };
    };
  },
  performanceTracking: PerformanceTracking | undefined,
  handleAnalyticsEvent: FireAnalyticsCallback,
) {
  if (performanceTracking?.contentRetrievalTracking?.enabled) {
    const DEFAULT_SAMPLING_RATE = 100;
    const getValue = editorActions.getValue.bind(editorActions);
    if (!editorActions._contentRetrievalTracking) {
      editorActions._contentRetrievalTracking = {
        samplingCounters: {
          success: 1,
          failure: 1,
        },
        getValueTracked: false,
      };
    }
    const {
      _contentRetrievalTracking: { samplingCounters, getValueTracked },
    } = editorActions;

    if (!getValueTracked) {
      const getValueWithTracking = async () => {
        try {
          const value = await getValue();
          if (
            samplingCounters.success ===
            (performanceTracking?.contentRetrievalTracking
              ?.successSamplingRate ?? DEFAULT_SAMPLING_RATE)
          ) {
            handleAnalyticsEvent({
              payload: {
                action: ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                actionSubject: ACTION_SUBJECT.EDITOR,
                attributes: {
                  success: true,
                },
                eventType: EVENT_TYPE.OPERATIONAL,
              },
            });
            samplingCounters.success = 0;
          }
          samplingCounters.success++;
          return value;
        } catch (err: any) {
          if (
            samplingCounters.failure ===
            (performanceTracking?.contentRetrievalTracking
              ?.failureSamplingRate ?? DEFAULT_SAMPLING_RATE)
          ) {
            handleAnalyticsEvent({
              payload: {
                action: ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                actionSubject: ACTION_SUBJECT.EDITOR,
                attributes: {
                  success: false,
                  errorInfo: err.toString(),
                  errorStack: performanceTracking?.contentRetrievalTracking
                    ?.reportErrorStack
                    ? err.stack
                    : undefined,
                },
                eventType: EVENT_TYPE.OPERATIONAL,
              },
            });
            samplingCounters.failure = 0;
          }
          samplingCounters.failure++;
          throw err;
        }
      };
      editorActions.getValue = getValueWithTracking;
      editorActions._contentRetrievalTracking.getValueTracked = true;
    }
  }
  return editorActions;
}
