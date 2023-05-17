import { EditorState, Transaction } from 'prosemirror-state';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { editorAnalyticsChannel } from './consts';
import { AnalyticsEventPayload } from './types';
import { analyticsPluginKey } from './plugin-key';
import { HigherOrderCommand } from '../../types/command';

function getCreateUIAnalyticsEvent(
  editorState: EditorState,
): CreateUIAnalyticsEvent | null | undefined {
  return analyticsPluginKey.getState(editorState)?.createAnalyticsEvent;
}

function getEditorAnalyticsAPI(
  editorState: EditorState,
): EditorAnalyticsAPI | null | undefined {
  return analyticsPluginKey.getState(editorState)?.editorAnalyticsApi;
}

/**
 *
 * @private
 * @deprecated
 *
 * Do not use this anymore. Please use @atlaskit/editor-plugin-analytics
 *
 */
export function addAnalytics(
  state: EditorState,
  tr: Transaction,
  payload: AnalyticsEventPayload,
  channel: string = editorAnalyticsChannel,
): Transaction {
  const createAnalyticsEvent = getCreateUIAnalyticsEvent(state);
  const editorAnalyticsApi = getEditorAnalyticsAPI(state);
  if (!createAnalyticsEvent || !editorAnalyticsApi) {
    return tr;
  }

  editorAnalyticsApi?.attachAnalyticsEvent(payload, channel)(tr);

  return tr;
}

export type AnalyticsEventPayloadCallback = (
  state: EditorState,
) => AnalyticsEventPayload | undefined;

// Below function has been copied to packages/editor/editor-plugin-ai/src/utils/analytics.ts
// If changes are made to this function, please make the same update in the linked file.
/**
 *
 * @private
 * @deprecated
 *
 * Do not use this anymore. Please use @atlaskit/editor-plugin-analytics
 *
 */
export function withAnalytics(
  payload: AnalyticsEventPayload | AnalyticsEventPayloadCallback,
  channel?: string,
): HigherOrderCommand {
  return (command) => (state, dispatch, view) =>
    command(
      state,
      (tr) => {
        if (dispatch) {
          if (payload instanceof Function) {
            const dynamicPayload = payload(state);
            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      },
      view,
    );
}
