import { EditorState } from 'prosemirror-state';
import { Mark } from 'prosemirror-model';
import {
  AnnotationAEPAttributes,
  RESOLVE_METHOD,
} from './../../analytics/types/inline-comment-events';
import { Command } from '../../../types';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/plugin-factory';
import {
  withAnalytics,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  ACTION,
  INPUT_METHOD,
} from '../../analytics';
import { AnalyticsEventPayloadCallback } from '../../analytics/utils';
import { AnalyticsEventPayload } from '../../analytics/types';
import { hasInlineNodes } from '../utils';
import {
  InlineCommentAction,
  ACTIONS,
  InlineCommentMap,
  InlineCommentMouseData,
} from '../pm-plugins/types';

export const updateInlineCommentResolvedState = (
  partialNewState: InlineCommentMap,
  resolveMethod?: RESOLVE_METHOD,
): Command => {
  const command: InlineCommentAction = {
    type: ACTIONS.UPDATE_INLINE_COMMENT_STATE,
    data: partialNewState,
  };

  const allResolved = Object.values(partialNewState).every(state => state);

  if (resolveMethod && allResolved) {
    return withAnalytics({
      action: ACTION.RESOLVED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        method: resolveMethod,
      },
    })(createCommand(command));
  }

  return createCommand(command);
};

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
      type: AnnotationTypes.INLINE_COMMENT,
    }),
  );

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

// get number of unique annotations within current selection
const getAnnotationsInSelectionCount = (state: EditorState): number => {
  const { annotation } = state.schema.marks;
  const { from, to } = state.selection;
  const annotations = new Set<string>();

  state.doc.nodesBetween(from, to, node => {
    node.marks.forEach((mark: Mark<any>) => {
      if (mark.type === annotation) {
        annotations.add(mark.attrs.id);
      }
    });
    return true; // be thorough, go through all children
  });

  return annotations.size;
};

export const setInlineCommentDraftState = (
  drafting: boolean,
  inputMethod:
    | INPUT_METHOD.TOOLBAR
    | INPUT_METHOD.SHORTCUT = INPUT_METHOD.TOOLBAR,
): Command => {
  const commandAction: (
    state: Readonly<EditorState<any>>,
  ) => InlineCommentAction | false = (editorState: EditorState) => {
    // validate selection only when entering draft mode
    if (drafting) {
      const selectionHasInlineNodes = hasInlineNodes(editorState);

      if (selectionHasInlineNodes || editorState.selection.empty) {
        return false;
      }
    }

    return {
      type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      data: {
        drafting,
        editorState,
      },
    };
  };

  const payload: AnalyticsEventPayloadCallback = (
    state: EditorState,
  ): AnalyticsEventPayload | undefined => {
    let attributes: AnnotationAEPAttributes = {};

    if (drafting) {
      attributes = {
        inputMethod,
        overlap: getAnnotationsInSelectionCount(state),
      };
    }

    return {
      action: drafting ? ACTION.OPENED : ACTION.CLOSED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes,
    };
  };

  return withAnalytics(payload)(createCommand(commandAction));
};

export const updateMouseState = (mouseData: InlineCommentMouseData): Command =>
  createCommand({
    type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: { mouseData },
  });
