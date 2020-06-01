import { addAnalytics, ACTION, EVENT_TYPE, ACTION_SUBJECT } from '../analytics';
import { EditorState, Transaction } from 'prosemirror-state';

export const addSynchronyErrorAnalytics = (
  state: EditorState,
  tr: Transaction,
) => {
  return (error: Error) =>
    addAnalytics(state, tr, {
      action: ACTION.SYNCHRONY_ERROR,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: { error },
    });
};
