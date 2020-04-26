import { EditorState } from 'prosemirror-state';
import {
  AnnotationActionType,
  AnnotationAEPAttributes,
  RESOLVE_METHOD,
} from './../../analytics/types/inline-comment-events';
import { Command } from '../../../types';
import { INLINE_COMMENT } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/plugin-factory';
import { ACTIONS } from '../pm-plugins/actions';
import {
  withAnalytics,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
} from '../../analytics';
import { InlineCommentAction } from '../types';
import { hasInlineNodes } from '../utils';

const createCommandWithAnalytics = (
  actionType: AnnotationActionType,
  attributes: AnnotationAEPAttributes,
  action:
    | InlineCommentAction
    | ((state: Readonly<EditorState<any>>) => InlineCommentAction | false),
) => {
  return withAnalytics({
    action: actionType,
    actionSubject: ACTION_SUBJECT.ANNOTATION,
    actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
    eventType: EVENT_TYPE.TRACK,
    attributes,
  })(createCommand(action));
};

export const setInlineCommentState = (newState: any): Command =>
  createCommand({
    type: ACTIONS.SET_INLINE_COMMENT_STATE,
    data: newState,
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
    .some(mark => mark.type === annotationMarkType);

  if (!hasAnnotation) {
    return false;
  }

  // just remove entire mark from around the node
  tr.removeMark(
    $from.start(),
    $from.end(),
    annotationMarkType.create({
      id,
      type: INLINE_COMMENT,
    }),
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

export const resolveInlineComment = (
  id: string,
  resolveMethod: RESOLVE_METHOD,
): Command => {
  const command: InlineCommentAction = {
    type: ACTIONS.INLINE_COMMENT_RESOLVE,
    data: { id },
  };
  return createCommandWithAnalytics(
    ACTION.RESOLVED,
    {
      method: resolveMethod,
    },
    command,
  );
};

export const setInlineCommentDraftState = (drafting: boolean): Command => {
  const commandAction: (
    state: Readonly<EditorState<any>>,
  ) => InlineCommentAction | false = (editorState: EditorState) => {
    const selectionInvalid = hasInlineNodes(editorState);

    if (selectionInvalid || editorState.selection.empty) {
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

  return createCommandWithAnalytics(
    drafting ? ACTION.OPENED : ACTION.CLOSED,
    // TODO: passing actual attributes to be implemented in ED-9116
    drafting
      ? {
          inputMethod: INPUT_METHOD.TOOLBAR,
          overlap: 0,
        }
      : {},
    commandAction,
  );
};

export const updateMouseState = (mouseData: {
  x?: number;
  y?: number;
  isSelecting?: boolean;
}): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: { mouseData },
  });
