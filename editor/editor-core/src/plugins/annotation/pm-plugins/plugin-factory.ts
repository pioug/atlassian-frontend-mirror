import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { InlineCommentAction, InlineCommentPluginState } from '../types';
import { ACTIONS } from './actions';
import { DecorationSet } from 'prosemirror-view';
import { addDraftDecoration } from '../utils';

export const inlineCommentPluginKey = new PluginKey('inlineCommentPluginKey');

function reducer(
  pluginState: InlineCommentPluginState,
  action: InlineCommentAction,
): InlineCommentPluginState {
  switch (action.type) {
    case ACTIONS.INLINE_COMMENT_RESOLVE:
      return {
        ...pluginState,
        annotations: { ...pluginState.annotations, [action.data.id]: true },
      };
    case ACTIONS.SET_INLINE_COMMENT_STATE:
      return { ...pluginState, annotations: action.data };
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
    default:
      return pluginState;
  }
}

export const { createPluginState, createCommand } = pluginFactory(
  inlineCommentPluginKey,
  reducer,
  {
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
