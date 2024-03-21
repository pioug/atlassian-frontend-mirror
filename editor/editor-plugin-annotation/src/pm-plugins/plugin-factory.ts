import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import {
  decorationKey,
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

    /**
     * Default we only handle caret selections.
     * Node selection will be handled separately.
     */
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

    mapping: (tr, pluginState, editorState) => {
      let { draftDecorationSet, bookmark, featureFlagsPluginState } =
        pluginState;
      let mappedDecorationSet: DecorationSet = DecorationSet.empty,
        mappedBookmark;
      let hasMappedDecorations = false;

      if (draftDecorationSet) {
        mappedDecorationSet = draftDecorationSet.map(tr.mapping, tr.doc);
      }

      if (featureFlagsPluginState?.commentsOnMedia) {
        hasMappedDecorations =
          mappedDecorationSet.find(undefined, undefined, spec =>
            Object.values(decorationKey).includes(spec.key),
          ).length > 0;

        // When changes to decoration target make decoration invalid (e.g. delete text, add mark to node),
        // we need to reset bookmark to hide create component and to avoid invalid draft being published
        if (!hasMappedDecorations) {
          return {
            ...pluginState,
            draftDecorationSet: mappedDecorationSet,
            bookmark: undefined,
          };
        }
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
