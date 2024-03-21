import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { isEmptyDocument } from '@atlaskit/editor-common/utils';
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
  forceHide: boolean;
}

export const key = new PluginKey<PluginState>('selectionMarker');

type DecorationType = 'blur' | 'highlight' | 'none';

function getDecorations(
  tr: ReadonlyTransaction,
  type: DecorationType,
): DecorationSet {
  const { selection } = tr;
  switch (type) {
    case 'none':
      return DecorationSet.empty;
    case 'highlight':
      return DecorationSet.create(tr.doc, [
        ...createWidgetDecoration(selection.$anchor, 'anchor', selection, true),
        selectionDecoration(selection, true),
        ...createWidgetDecoration(selection.$head, 'head', selection, true),
      ]);
    case 'blur':
      return DecorationSet.create(tr.doc, [
        ...createWidgetDecoration(
          selection.$anchor,
          'anchor',
          selection,
          false,
        ),
        selectionDecoration(selection, false),
      ]);
  }
}

function getDecorationType(
  tr: ReadonlyTransaction,
  forceHide: boolean,
  shouldHideDecorations: boolean,
): DecorationType {
  if (shouldHideDecorations || forceHide || isEmptyDocument(tr.doc)) {
    return 'none';
  }
  // TODO: implement "highlight" for AI features
  return 'blur';
}

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
          forceHide: false,
        };
      },
      apply(tr: ReadonlyTransaction, currentState: PluginState) {
        const forceHide = tr.getMeta(key)?.forceHide ?? currentState.forceHide;
        const shouldHideDecorations =
          tr.getMeta(key)?.shouldHideDecorations ??
          currentState.shouldHideDecorations;
        const type = getDecorationType(tr, forceHide, shouldHideDecorations);
        return {
          decorations: getDecorations(tr, type),
          shouldHideDecorations,
          forceHide,
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
