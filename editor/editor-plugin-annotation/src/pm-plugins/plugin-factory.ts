import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';

import {
  findAnnotationsInSelection,
  inlineCommentPluginKey,
  isSelectedAnnotationsChanged,
} from '../utils';

import reducer from './reducer';
import type { InlineCommentPluginState } from './types';

const handleDocChanged = (
  tr: ReadonlyTransaction,
  prevPluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
  if (!tr.getMeta('replaceDocument')) {
    return getSelectionChangedHandler(false)(tr, prevPluginState);
  }

  return { ...prevPluginState, dirtyAnnotations: true };
};

const getSelectionChangedHandler =
  (reopenCommentView: boolean) =>
  (
    tr: ReadonlyTransaction,
    pluginState: InlineCommentPluginState,
  ): InlineCommentPluginState => {
    if (pluginState.skipSelectionHandling) {
      return {
        ...pluginState,
        skipSelectionHandling: false,
        ...(reopenCommentView && {
          isInlineCommentViewClosed: false,
        }),
      };
    }

    const selectedAnnotations = findAnnotationsInSelection(
      tr.selection,
      tr.doc,
    );

    if (selectedAnnotations.length === 0) {
      return {
        ...pluginState,
        selectedAnnotations,
        isInlineCommentViewClosed: true,
      };
    }

    if (
      isSelectedAnnotationsChanged(
        selectedAnnotations,
        pluginState.selectedAnnotations,
      )
    ) {
      return {
        ...pluginState,
        selectedAnnotations,
        ...(reopenCommentView && {
          isInlineCommentViewClosed: false,
        }),
      };
    }
    return {
      ...pluginState,
      ...(reopenCommentView && {
        isInlineCommentViewClosed: false,
      }),
    };
  };

export const { createPluginState, createCommand } = pluginFactory(
  inlineCommentPluginKey,
  reducer,
  {
    onSelectionChanged: getSelectionChangedHandler(true),
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
