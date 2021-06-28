import { EditorState } from 'prosemirror-state';
import { RESOLVE_METHOD } from './../../analytics/types/inline-comment-events';
import { Command } from '../../../types';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/plugin-factory';
import { INPUT_METHOD } from '../../analytics';
import { isSelectionValid, getPluginState } from '../utils';
import {
  InlineCommentAction,
  ACTIONS,
  InlineCommentMap,
  InlineCommentMouseData,
} from '../pm-plugins/types';

import transform from './transform';
import { AnnotationSelectionType } from '../types';

export const updateInlineCommentResolvedState = (
  partialNewState: InlineCommentMap,
  resolveMethod?: RESOLVE_METHOD,
): Command => {
  const command: InlineCommentAction = {
    type: ACTIONS.UPDATE_INLINE_COMMENT_STATE,
    data: partialNewState,
  };

  const allResolved = Object.values(partialNewState).every((state) => state);

  if (resolveMethod && allResolved) {
    return createCommand(command, transform.addResolveAnalytics(resolveMethod));
  }

  return createCommand(command);
};

export const closeComponent = (): Command =>
  createCommand({
    type: ACTIONS.CLOSE_COMPONENT,
  });

export const clearDirtyMark = (): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK,
  });

export const removeInlineCommentNearSelection = (id: string): Command => (
  state,
  dispatch,
): boolean => {
  const {
    tr,
    selection: { $from },
  } = state;
  const { annotation: annotationMarkType } = state.schema.marks;

  const hasAnnotation = $from
    .marks()
    .some((mark) => mark.type === annotationMarkType);

  if (!hasAnnotation) {
    return false;
  }

  // just remove entire mark from around the node
  tr.removeMark(
    $from.start(),
    $from.end(),
    annotationMarkType.create({
      id,
      type: AnnotationTypes.INLINE_COMMENT,
    }),
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

const getDraftCommandAction: (
  drafting: boolean,
) => (state: Readonly<EditorState<any>>) => InlineCommentAction | false = (
  drafting: boolean,
) => {
  return (editorState: EditorState) => {
    // validate selection only when entering draft mode
    if (
      drafting &&
      isSelectionValid(editorState) !== AnnotationSelectionType.VALID
    ) {
      return false;
    }

    return {
      type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      data: {
        drafting,
        editorState,
      },
    };
  };
};

export const setInlineCommentDraftState = (
  drafting: boolean,
  inputMethod:
    | INPUT_METHOD.TOOLBAR
    | INPUT_METHOD.SHORTCUT = INPUT_METHOD.TOOLBAR,
): Command => {
  const commandAction = getDraftCommandAction(drafting);
  return createCommand(
    commandAction,
    transform.addOpenCloseAnalytics(drafting, inputMethod),
  );
};

export const addInlineComment = (id: string): Command => {
  const commandAction: (editorState: EditorState) => InlineCommentAction = (
    editorState: EditorState,
  ) => ({
    type: ACTIONS.ADD_INLINE_COMMENT,
    data: {
      drafting: false,
      inlineComments: { [id]: false },
      // Auto make the newly inserted comment selected.
      // We move the selection to the head of the comment selection.
      selectedAnnotations: [{ id, type: AnnotationTypes.INLINE_COMMENT }],
      editorState,
    },
  });

  return createCommand(commandAction, transform.addInlineComment(id));
};

export const updateMouseState = (mouseData: InlineCommentMouseData): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: { mouseData },
  });

export const createAnnotation = (
  id: string,
  annotationType: AnnotationTypes = AnnotationTypes.INLINE_COMMENT,
): Command => (state, dispatch) => {
  // don't try to add if there are is no temp highlight bookmarked
  const { bookmark } = getPluginState(state) || {};
  if (!bookmark || !dispatch) {
    return false;
  }

  if (annotationType === AnnotationTypes.INLINE_COMMENT) {
    return addInlineComment(id)(state, dispatch);
  }

  return false;
};

export const setInlineCommentsVisibility = (isVisible: boolean): Command => {
  return createCommand({
    type: ACTIONS.INLINE_COMMENT_SET_VISIBLE,
    data: { isVisible },
  });
};
