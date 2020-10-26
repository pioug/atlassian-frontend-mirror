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

export type EntityEventType = 'error' | 'disconnected';

export const addSynchronyEntityAnalytics = (
  state: EditorState,
  tr: Transaction,
) => {
  return (type: EntityEventType) =>
    addAnalytics(state, tr, {
      action:
        type === 'error'
          ? ACTION.SYNCHRONY_ENTITY_ERROR
          : ACTION.SYNCHRONY_DISCONNECTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
        onLine: navigator.onLine,
        visibilityState: document.visibilityState,
      },
    });
};
