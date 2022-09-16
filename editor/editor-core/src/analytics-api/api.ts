import type { EditorView } from 'prosemirror-view';
import type {
  AnalyticsEventPayload,
  EditorAnalyticsAPI,
} from '@atlaskit/editor-common/analytics';
import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { Transaction } from 'prosemirror-state';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { attachPayloadIntoTransaction } from './attach-payload-into-transaction';

type Props = {
  // To avoid race conditions issues during the insertion phase,
  // we need a fresh EditorView pointer to get the current EditorState
  getEditorView: () => EditorView | undefined | null;

  getCreateUIAnalyticsEvent: () => CreateUIAnalyticsEvent | undefined | null;
};

export const createEditorAnalyticsAPI = ({
  getEditorView,
  getCreateUIAnalyticsEvent,
}: Props): EditorAnalyticsAPI => {
  return {
    attachAnalyticsEvent: (payload: AnalyticsEventPayload) => {
      return (tr: Transaction) => {
        const createAnalyticsEvent = getCreateUIAnalyticsEvent();
        const editorView = getEditorView();
        if (!tr || !createAnalyticsEvent || !editorView) {
          return false;
        }

        const { state: editorState } = editorView;

        attachPayloadIntoTransaction({
          tr,
          editorState,
          payload,
          channel: FabricChannel.editor,
        });

        return true;
      };
    },
  };
};
