import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type {
  EditorState,
  ReadonlyTransaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { SelectionMarkerPlugin } from '../types';
import { selectionDecoration } from '../ui/selection-decoration';
import { createWidgetDecoration } from '../ui/widget-decoration';

interface PluginState {
  decorations: DecorationSet;
  shouldHideDecorations: boolean;
}

export const key = new PluginKey<PluginState>('selectionMarker');

export const createPlugin = (
  api: ExtractInjectionAPI<SelectionMarkerPlugin> | undefined,
) => {
  return new SafePlugin({
    key,
    state: {
      init() {
        return {
          decorations: DecorationSet.empty,
          shouldHideDecorations: true,
        };
      },
      apply(tr: ReadonlyTransaction, currentState: PluginState) {
        const shouldHideDecorations =
          tr.getMeta(key)?.shouldHideDecorations ??
          currentState.shouldHideDecorations;

        const { selection } = tr;

        if (shouldHideDecorations) {
          return {
            decorations: DecorationSet.empty,
            shouldHideDecorations,
          };
        }

        return {
          decorations: DecorationSet.create(tr.doc, [
            ...createWidgetDecoration(selection.$anchor, 'anchor', selection),
            selectionDecoration(selection),
            ...createWidgetDecoration(selection.$head, 'head', selection),
          ]),
          shouldHideDecorations,
        };
      },
    },
    props: {
      decorations: (state: EditorState) => {
        return key.getState(state)?.decorations;
      },
    },
  });
};

export function dispatchShouldHideDecorations(
  editorView: EditorView,
  shouldHideDecorations: boolean,
) {
  const { dispatch, state } = editorView;
  dispatch(
    state.tr.setMeta(key, {
      shouldHideDecorations,
    }),
  );
}
