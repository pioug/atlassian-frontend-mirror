import { PluginKey, Transaction } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { addDraftDecoration, findAnnotationsInSelection } from '../utils';
import {
  ACTIONS,
  InlineCommentAction,
  InlineCommentPluginState,
} from './types';

export const inlineCommentPluginKey = new PluginKey('inlineCommentPluginKey');

function reducer(
  pluginState: InlineCommentPluginState,
  action: InlineCommentAction,
): InlineCommentPluginState {
  switch (action.type) {
    case ACTIONS.UPDATE_INLINE_COMMENT_STATE:
      return {
        ...pluginState,
        annotations: { ...pluginState.annotations, ...action.data },
      };
    case ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE:
      const mouseData = Object.assign(
        {},
        pluginState.mouseData,
        action.data.mouseData,
      );

      return {
        ...pluginState,
        mouseData,
      };
    case ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE:
      let { draftDecorationSet } = pluginState;
      let { drafting, editorState } = action.data;

      if (!draftDecorationSet || !drafting) {
        draftDecorationSet = DecorationSet.empty;
      }

      let newState = { ...pluginState, draftDecorationSet };
      newState.bookmark = undefined;

      if (drafting && editorState) {
        newState.bookmark = editorState.selection.getBookmark();
        const resolvedBookmark = newState.bookmark.resolve(editorState.doc);
        const draftDecoration = addDraftDecoration(
          resolvedBookmark.from,
          resolvedBookmark.to,
        );
        newState.draftDecorationSet = draftDecorationSet.add(editorState.doc, [
          draftDecoration,
        ]);
      }

      return newState;
    case ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK:
      return {
        ...pluginState,
        dirtyAnnotations: false,
        annotations: {},
      };
    default:
      return pluginState;
  }
}

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
