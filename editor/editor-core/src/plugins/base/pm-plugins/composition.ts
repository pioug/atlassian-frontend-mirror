import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';

interface CompositionPluginState {
  isComposing: boolean;
  zeroWidthSpacePos?: number;
}

const compositionPluginKey = new PluginKey<CompositionPluginState>(
  'compositionPlugin',
);

export const isComposing = (state: EditorState) => {
  return !!compositionPluginKey.getState(state)?.isComposing;
};

const isLinux = () => navigator.userAgent.indexOf('Linux') >= 0;

export default () =>
  new SafePlugin<CompositionPluginState>({
    key: compositionPluginKey,
    state: {
      init: (): CompositionPluginState => ({
        isComposing: false,
        zeroWidthSpacePos: undefined,
      }),
      apply: (tr, value): CompositionPluginState => {
        const isComposing: boolean = tr.getMeta(compositionPluginKey);
        const zeroWidthSpacePos: number = tr.getMeta('zeroWidthSpacePos');
        if (typeof isComposing === 'undefined') {
          return value;
        }

        return {
          isComposing,
          zeroWidthSpacePos,
        };
      },
    },
    props: {
      handleDOMEvents: {
        compositionstart: (view: EditorView, event: Event): boolean => {
          const { tr } = view.state;
          tr.setMeta(compositionPluginKey, true);

          // only apply for linux and cursor is at start of line
          if (isLinux() && view.state.selection.$from.parentOffset === 0) {
            tr.insertText(ZERO_WIDTH_SPACE);

            // remember the position of inserted zero width space
            tr.setMeta('zeroWidthSpacePos', view.state.selection.$from.pos);
          }

          view.dispatch(tr);
          return false;
        },
        compositionend: (view: EditorView, event: Event): boolean => {
          const { tr } = view.state;
          tr.setMeta(compositionPluginKey, false);

          if (isLinux()) {
            const zeroWidthSpacePos = compositionPluginKey.getState(
              view.state,
            )?.zeroWidthSpacePos;
            if (typeof zeroWidthSpacePos !== 'undefined') {
              tr.deleteRange(zeroWidthSpacePos, zeroWidthSpacePos + 1);
            }
            tr.setMeta('zeroWidthSpacePos', undefined);
          }

          view.dispatch(tr);
          return false;
        },
      },
    },
  });
