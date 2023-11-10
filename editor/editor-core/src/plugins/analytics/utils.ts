import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { editorAnalyticsChannel } from './consts';
import type { AnalyticsEventPayload } from './types';
import { analyticsPluginKey } from './plugin-key';

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
