import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

interface CompositionPluginState {
  isComposing: boolean;
}

const compositionPluginKey = new PluginKey<CompositionPluginState>(
  'compositionPlugin',
);

export const isComposing = (state: EditorState) => {
  return compositionPluginKey.getState(state).isComposing;
};

export default () =>
  new SafePlugin<CompositionPluginState>({
    key: compositionPluginKey,
    state: {
      init: (): CompositionPluginState => ({
        isComposing: false,
      }),
      apply: (tr, value): CompositionPluginState => {
        const isComposing: boolean = tr.getMeta(compositionPluginKey);
        if (typeof isComposing === 'undefined') {
          return value;
        }

        return {
          isComposing,
        };
      },
    },
    props: {
      handleDOMEvents: {
        compositionstart: (view: EditorView, event: Event): boolean => {
          const { tr } = view.state;
          tr.setMeta(compositionPluginKey, true);
          view.dispatch(tr);
          return false;
        },
        compositionend: (view: EditorView, event: Event): boolean => {
          const { tr } = view.state;
          tr.setMeta(compositionPluginKey, false);
          view.dispatch(tr);
          return false;
        },
      },
    },
  });
