import {
  InlineCommentAction,
  InlineCommentPluginState,
  ACTIONS,
} from './types';
import { DecorationSet } from 'prosemirror-view';
import { addDraftDecoration } from '../utils';
import { EditorState } from 'prosemirror-state';

export default (
  pluginState: InlineCommentPluginState,
  action: InlineCommentAction,
): InlineCommentPluginState => {
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
      return getNewDraftState(
        pluginState,
        action.data.drafting,
        action.data.editorState,
      );
    case ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK:
      return {
        ...pluginState,
        dirtyAnnotations: false,
        annotations: {},
      };
    case ACTIONS.CLOSE_COMPONENT:
      return {
        ...pluginState,
        selectedAnnotations: [],
      };
    case ACTIONS.ADD_INLINE_COMMENT:
      const updatedPluginState = getNewDraftState(
        pluginState,
        action.data.drafting,
        action.data.editorState,
      );
      return {
        ...updatedPluginState,
        selectedAnnotations: [
          ...updatedPluginState.selectedAnnotations,
          ...action.data.selectedAnnotations,
        ],
        annotations: {
          ...pluginState.annotations,
          ...action.data.inlineComments,
        },
      };
    case ACTIONS.INLINE_COMMENT_SET_VISIBLE:
      const { isVisible } = action.data;

      if (isVisible === pluginState.isVisible) {
        return pluginState;
      }

      return {
        ...(isVisible ? pluginState : getNewDraftState(pluginState, false)),
        isVisible,
      };

    default:
      return pluginState;
  }
};

function getNewDraftState(
  pluginState: InlineCommentPluginState,
  drafting: boolean,
  editorState?: EditorState<any>,
) {
  let { draftDecorationSet } = pluginState;

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
}
