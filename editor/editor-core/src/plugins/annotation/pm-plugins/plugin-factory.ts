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
    return handleSelectionChanged(tr, prevPluginState);
  }

  return { ...prevPluginState, dirtyAnnotations: true };
};

const handleSelectionChanged = (
  tr: Transaction,
  pluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
  const selectedAnnotations = findAnnotationsInSelection(tr.selection, tr.doc);
  const changed =
    selectedAnnotations.length !== pluginState.selectedAnnotations.length ||
    selectedAnnotations.some((annotationInfo) => {
      return !pluginState.selectedAnnotations.some(
        (aInfo) => aInfo.type === annotationInfo.id,
      );
    });

  if (changed) {
    return {
      ...pluginState,
      selectedAnnotations,
    };
  }
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
