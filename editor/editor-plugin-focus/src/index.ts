import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type FocusPlugin = NextEditorPlugin<
  'focus',
  { sharedState: { hasFocus: boolean } }
>;
const focusPlugin: FocusPlugin = (_, api) => {
  const viewRef: { current: EditorView | null } = { current: null };
  return {
    name: 'focus',

    getSharedState() {
      return {
        hasFocus: Boolean(viewRef.current?.hasFocus()),
      };
    },

    pmPlugins() {
      const plugin = new SafePlugin({
        view(view) {
          viewRef.current = view;
          return {
            destroy() {
              viewRef.current = null;
            },
          };
        },

        props: {
          handleDOMEvents: {
            focus: view => {
              view.dispatch(view.state.tr);
              return false;
            },
            blur: view => {
              view.dispatch(view.state.tr);
              return false;
            },
          },
        },
      });

      return [
        {
          name: 'focusHandlerPlugin',
          plugin: () => plugin,
        },
      ];
    },
  };
};

export { focusPlugin };
