import { EditorState, Transaction } from 'prosemirror-state';
import { pluginKey } from './plugin-key';

export const showPlaceholderFloatingToolbar = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  const tr = state.tr;

  if (!state.selection.empty) {
    tr.deleteSelection();
  }

  tr.setMeta(pluginKey, { showInsertPanelAt: tr.selection.anchor });
  tr.scrollIntoView();

  dispatch(tr);
  return true;
};

export const insertPlaceholderTextAtSelection = (value: string) => (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
): boolean => {
  dispatch(
    state.tr
      .replaceSelectionWith(
        state.schema.nodes.placeholder.createChecked({ text: value }),
      )
      .setMeta(pluginKey, { showInsertPanelAt: null })
      .scrollIntoView(),
  );
  return true;
};

export const hidePlaceholderFloatingToolbar = (
  state: EditorState,
  dispatch: (tr: Transaction) => void,
) => {
  dispatch(state.tr.setMeta(pluginKey, { showInsertPanelAt: null }));
  return true;
};
