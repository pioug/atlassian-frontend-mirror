import type { Fragment, Node } from '@atlaskit/editor-prosemirror/model';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import { pluginKey } from './plugin-key';
import type { EditorCommand, Command } from '@atlaskit/editor-common/types';

export const openElementBrowserModal: EditorCommand = ({ tr }) =>
  tr.setMeta(pluginKey, { isElementBrowserModalOpen: true });

export const closeElementBrowserModal = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: false }));
  }
  return true;
};

// this method was adapted from the typeahead plugin so we respect the API for quick insert items
export const insertItem =
  (item: QuickInsertItem): Command =>
  (state, dispatch) => {
    const insert = (
      maybeNode?: Node | Object | string | Fragment,
      opts: { selectInlineNode?: boolean } = {},
    ) => {
      return insertSelectedItem(maybeNode, opts)(
        state,
        state.tr,
        state.selection.head,
      );
    };

    const tr = item.action(insert, state);

    /** @note There is no transaction when called without a search currently (different insert) */
    if (tr && dispatch) {
      dispatch(tr);
    }

    return true;
  };
