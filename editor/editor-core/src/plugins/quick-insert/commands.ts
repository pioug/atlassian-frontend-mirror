import type { Fragment, Node } from '@atlaskit/editor-prosemirror/model';

import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import { insertSelectedItem } from '@atlaskit/editor-common/insert';

import type { Command } from '../../types';
import { pluginKey } from './plugin-key';

export const openElementBrowserModal = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: true }));
  }
  return true;
};

export const closeElementBrowserModal = (): Command => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, { isElementBrowserModalOpen: false }));
  }
  return true;
};

// this method was adapted from the typeahed plugin so we respect the API for quick insert items
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
