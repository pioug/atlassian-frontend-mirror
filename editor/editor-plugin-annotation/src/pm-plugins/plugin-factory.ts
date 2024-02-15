import { pluginFactory } from '@atlaskit/editor-common/utils';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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
    return getBooleanFF(
      'platform.editor.annotation.decouple-inline-comment-closed_flmox',
    )
      ? getSelectionChangedHandler(false)(tr, prevPluginState)
      : handleSelectionChanged(tr, prevPluginState);
  }

  return { ...prevPluginState, dirtyAnnotations: true };
};

const handleSelectionChanged = (
  tr: ReadonlyTransaction,
  pluginState: InlineCommentPluginState,
): InlineCommentPluginState => {
  if (pluginState.skipSelectionHandling) {
    return {
      ...pluginState,
      skipSelectionHandling: false,
    };
  }

  const selectedAnnotations = findAnnotationsInSelection(tr.selection, tr.doc);
  const changed =
    selectedAnnotations.length !== pluginState.selectedAnnotations.length ||
    selectedAnnotations.some(annotationInfo => {
      return !pluginState.selectedAnnotations.some(
        aInfo => aInfo.type === annotationInfo.id,
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

const getSelectionChangedHandler =
  (reopenCommentView: boolean) =>
  (
    tr: ReadonlyTransaction,
    pluginState: InlineCommentPluginState,
  ): InlineCommentPluginState => {
    /**
     * If feature flag is **OFF** we want to keep the old behavior. Note that
     * reopenCommentView is not relevant here when using old behaviour.
     *
     * Feature flag is evaluated here rather than directly in onSelectionChanged where it is assigned
     * to prevent the plugin from setting up the handler before the feature flag is evaluated.
     *
     * This comment / logic can be cleaned up once the feature flag is removed.
     */
    if (
      !getBooleanFF(
        'platform.editor.annotation.decouple-inline-comment-closed_flmox',
      )
    ) {
      return handleSelectionChanged(tr, pluginState);
    }
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
