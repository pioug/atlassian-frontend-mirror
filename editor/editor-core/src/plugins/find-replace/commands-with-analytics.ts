import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { TextSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Command } from '../../types';
import type { TRIGGER_METHOD } from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '../analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import {
  activate,
  find,
  findNext,
  findPrevious,
  replace,
  replaceAll,
  cancelSearch,
} from './commands';

export const activateWithAnalytics = ({
  triggerMethod,
}: {
  triggerMethod: TRIGGER_METHOD.SHORTCUT | TRIGGER_METHOD.TOOLBAR;
}): Command =>
  withAnalytics((state: EditorState) => ({
    eventType: EVENT_TYPE.UI,
    action: ACTION.ACTIVATED,
    actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
    attributes: {
      inputMethod:
        state.selection instanceof TextSelection && !state.selection.empty
          ? INPUT_METHOD.PREFILL
          : INPUT_METHOD.KEYBOARD,
      triggerMethod,
    },
  }))(activate());

export const findWithAnalytics = ({
  editorView,
  containerElement,
  keyword,
}: {
  editorView: EditorView;
  containerElement: HTMLElement | null;
  keyword?: string;
}) =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT,
  })(find(editorView, containerElement, keyword));

export const findNextWithAnalytics = ({
  triggerMethod,
}: {
  triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_NEXT_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod,
    },
  })(findNext());

export const findPrevWithAnalytics = ({
  triggerMethod,
}: {
  triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_PREV_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod,
    },
  })(findPrevious());

export const replaceWithAnalytics = ({
  triggerMethod,
  replaceText,
}: {
  triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
  replaceText: string;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.REPLACED_ONE,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod,
    },
  })(replace(replaceText));

export const replaceAllWithAnalytics = ({
  replaceText,
}: {
  replaceText: string;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.REPLACED_ALL,
    actionSubject: ACTION_SUBJECT.TEXT,
  })(replaceAll(replaceText));

export const cancelSearchWithAnalytics = ({
  triggerMethod,
}: {
  triggerMethod:
    | TRIGGER_METHOD.KEYBOARD
    | TRIGGER_METHOD.TOOLBAR
    | TRIGGER_METHOD.BUTTON;
}): Command =>
  withAnalytics({
    eventType: EVENT_TYPE.UI,
    action: ACTION.DEACTIVATED,
    actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
    attributes: {
      triggerMethod,
    },
  })(cancelSearch());
