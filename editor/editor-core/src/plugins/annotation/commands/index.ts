import { Command } from '../../../types';
import { INLINE_COMMENT } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/plugin-factory';

export const setInlineCommentState = (newState: any): Command =>
  createCommand({
    type: 'SET_INLINE_COMMENT_STATE',
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

export const resolveInlineComment = (id: string): Command =>
  createCommand({ type: 'INLINE_COMMENT_RESOLVE', data: { id } });
