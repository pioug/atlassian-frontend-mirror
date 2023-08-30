import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

const key = new PluginKey<FocusState>('focusPluginHandler');
type FocusState = { hasFocus: boolean };
export type FocusPlugin = NextEditorPlugin<
  'focus',
  { sharedState: FocusState }
>;

/**
 * Focus plugin to be added to an `EditorPresetBuilder` and used with `ComposableEditor`
 * from `@atlaskit/editor-core`.
 */
const focusPlugin: FocusPlugin = ({ api }) => {
  return {
    name: 'focus',

    getSharedState(editorState) {
      if (!editorState) {
        return {
          hasFocus: false,
        };
      }

      return {
        hasFocus: Boolean(key.getState(editorState)?.hasFocus),
      };
    },

    pmPlugins() {
      const plugin = new SafePlugin<FocusState>({
        key,
        state: {
          init() {
            return {
              hasFocus: false,
            };
          },

          apply(tr, oldPluginState) {
            const meta = tr.getMeta(key) as boolean;
            if (typeof meta === 'boolean') {
              if (meta !== oldPluginState.hasFocus) {
                return {
                  hasFocus: meta,
                };
              }
            }
            return oldPluginState;
          },
        },

        props: {
          handleDOMEvents: {
            focus: view => {
              const focusState = key.getState(view.state);
              if (!focusState?.hasFocus) {
                view.dispatch(view.state.tr.setMeta(key, true));
              }
              return false;
            },
            blur: view => {
              const focusState = key.getState(view.state);
              if (focusState?.hasFocus) {
                view.dispatch(view.state.tr.setMeta(key, false));
              }
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
