import React from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type {
  ExtractInjectionAPI,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import VisuallyHidden from '@atlaskit/visually-hidden';

export type AccessibilityUtilsPlugin = NextEditorPlugin<
  'accessibilityUtils',
  {
    dependencies: [];
    actions: {
      /**
       *
       * @param {string} message - Message to be announced to screen readers. This should be internationalized.
       *
       * These are currently announced via assertive live regions to screen readers.
       *
       * *In future, the ariaNotify proposal looks like a good fit for this use case.  The naming has been selected to align with this proposal.
       */
      // The ariaNotify proposal looks like a good fit for this use case in future.
      // This is not currently implemented in any browser.
      // https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Accessibility/AriaNotify/explainer.md
      ariaNotify: (message: string) => void;
    };
    sharedState: { message: string };
  }
>;

export const accessibilityUtilsPluginKey = new PluginKey(
  'accessibilityUtilsPlugin',
);

export const accessibilityUtilsPlugin: AccessibilityUtilsPlugin = ({ api }) => {
  let editorView: EditorView | undefined;
  const setEditorView = (newEditorView: EditorView) => {
    editorView = newEditorView;
  };

  return {
    name: 'accessibilityUtils',
    actions: {
      ariaNotify: message => {
        if (!editorView) {
          // at time of writing, this should never happen
          return;
        }

        const tr = editorView.state.tr;
        tr.setMeta(accessibilityUtilsPluginKey, { message });
        editorView.dispatch(tr);

        return;
      },
    },
    contentComponent: () => {
      return <ContentComponent api={api} />;
    },
    getSharedState(editorState) {
      if (!editorState) {
        return null;
      }
      return accessibilityUtilsPluginKey.getState(editorState);
    },
    pmPlugins() {
      return [
        {
          name: 'get-editor-view',
          plugin: () => {
            return new SafePlugin({
              key: accessibilityUtilsPluginKey,
              state: {
                init: () => ({
                  message: '',
                }),
                apply: (
                  tr: ReadonlyTransaction,
                  prevState: { message: string },
                ) => {
                  const meta = tr.getMeta(accessibilityUtilsPluginKey);
                  if (meta && 'message' in meta) {
                    return { message: meta.message };
                  }
                  return prevState;
                },
              },
              view(editorView: EditorView) {
                setEditorView(editorView);
                return {};
              },
            });
          },
        },
      ];
    },
  };
};

function ContentComponent({
  api,
}: {
  api: ExtractInjectionAPI<AccessibilityUtilsPlugin> | undefined;
}) {
  const { accessibilityUtilsState } = useSharedPluginState(api, [
    'accessibilityUtils',
  ]);

  return (
    <VisuallyHidden role="alert">
      {accessibilityUtilsState?.message}
    </VisuallyHidden>
  );
}
