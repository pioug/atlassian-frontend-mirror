import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { DecorationSet } from '@atlaskit/editor-prosemirror/view';

import type { TargetType } from '../types';
import { addDraftDecoration, resolveDraftBookmark } from '../utils';

import type { InlineCommentAction, InlineCommentPluginState } from './types';
import { ACTIONS } from './types';

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
        action.data.targetType,
        action.data.isCommentOnMediaOn,
        action.data.supportedBlockNodes,
        action.data.targetNodeId,
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
        isInlineCommentViewClosed: true,
        isDrafting: false,
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
        isInlineCommentViewClosed: false,
        selectAnnotationMethod: undefined,
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
    case ACTIONS.SET_SELECTED_ANNOTATION:
      return {
        ...pluginState,
        selectedAnnotations: [...action.data.selectedAnnotations],
        selectAnnotationMethod: action.data.selectAnnotationMethod,
        skipSelectionHandling: true,
        isInlineCommentViewClosed: false,
      };
    default:
      return pluginState;
  }
};

function getNewDraftState(
  pluginState: InlineCommentPluginState,
  drafting: boolean,
  editorState?: EditorState,
  targetType?: TargetType,
  isCommentOnMediaOn?: boolean,
  supportedBlockNodes?: string[],
  targetNodeId?: string,
) {
  let { draftDecorationSet } = pluginState;

  if (!draftDecorationSet || !drafting) {
    draftDecorationSet = DecorationSet.empty;
  }

  let newState = {
    ...pluginState,
    draftDecorationSet,
    isDrafting: drafting,
    targetNodeId,
  };

  newState.bookmark = undefined;

  if (drafting && editorState) {
    newState.bookmark = editorState.selection.getBookmark();
    const { from, to } = isCommentOnMediaOn
      ? resolveDraftBookmark(
          editorState,
          newState.bookmark,
          supportedBlockNodes,
        )
      : newState.bookmark.resolve(editorState.doc);

    const draftDecoration = addDraftDecoration(from, to, targetType);
    newState.draftDecorationSet = draftDecorationSet.add(editorState.doc, [
      draftDecoration,
    ]);
  }

  return newState;
}
