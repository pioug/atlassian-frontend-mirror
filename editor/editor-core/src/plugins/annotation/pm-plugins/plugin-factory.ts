import { Transaction } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { findAnnotationsInSelection, inlineCommentPluginKey } from '../utils';
import { InlineCommentPluginState } from './types';

import reducer from './reducer';

const handleDocChanged = (
  tr: Transaction,
  prevPluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
  if (!tr.getMeta('replaceDocument')) {
    return prevPluginState;
  }

  return { ...prevPluginState, dirtyAnnotations: true };
};

const handleSelectionChanged = (
  tr: Transaction,
  pluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
  pluginState.selectedAnnotations = findAnnotationsInSelection(
    tr.selection,
    tr.doc,
  );
  return pluginState;
};

export const { createPluginState, createCommand } = pluginFactory(
  inlineCommentPluginKey,
  reducer,
  {
    onSelectionChanged: handleSelectionChanged,
    onDocChanged: handleDocChanged,

    mapping: (tr, pluginState) => {
      let { draftDecorationSet, bookmark } = pluginState;
      let mappedDecorationSet, mappedBookmark;
      if (draftDecorationSet) {
        mappedDecorationSet = draftDecorationSet.map(tr.mapping, tr.doc);
      }
      if (bookmark) {
        mappedBookmark = bookmark.map(tr.mapping);
      }

      // return same pluginState if mappings did not change
      if (
        mappedBookmark === bookmark &&
        mappedDecorationSet === draftDecorationSet
      ) {
        return pluginState;
      }

      return {
        ...pluginState,
        draftDecorationSet: mappedDecorationSet,
        bookmark: mappedBookmark,
      };
    },
  },
);
