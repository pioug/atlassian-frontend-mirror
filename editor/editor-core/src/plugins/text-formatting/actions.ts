import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import { toggleMark } from '@atlaskit/editor-common/mark';
import type { Command, InputMethodBasic } from '@atlaskit/editor-common/types';

type ToggleMarkCommand = () => Command;

export type ToggleMarkWithAnalyticsCommand = (analyticsMetadata: {
  inputMethod: InputMethodBasic;
}) => Command;

type ToggleMarkWithAnalyticsFactory = (
  editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
) => ToggleMarkWithAnalyticsCommand;

export const toggleEm: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { em } = state.schema.marks;
    if (em) {
      return toggleMark(em)(state, dispatch);
    }
    return false;
  };
};

export const toggleEmWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
      attributes: {
        inputMethod,
      },
    })(toggleEm());

export const toggleStrike: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { strike } = state.schema.marks;
    if (strike) {
      return toggleMark(strike)(state, dispatch);
    }
    return false;
  };
};

export const toggleStrikeWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
      attributes: {
        inputMethod,
      },
    })(toggleStrike());

export const toggleStrong: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { strong } = state.schema.marks;
    if (strong) {
      return toggleMark(strong)(state, dispatch);
    }
    return false;
  };
};

export const toggleStrongWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
      attributes: {
        inputMethod,
      },
    })(toggleStrong());

export const toggleUnderline: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { underline } = state.schema.marks;
    if (underline) {
      return toggleMark(underline)(state, dispatch);
    }
    return false;
  };
};

export const toggleUnderlineWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
      attributes: {
        inputMethod,
      },
    })(toggleUnderline());

export const toggleSuperscript: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { subsup } = state.schema.marks;
    if (subsup) {
      return toggleMark(subsup, { type: 'sup' })(state, dispatch);
    }
    return false;
  };
};

export const toggleSuperscriptWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUPER,
      attributes: {
        inputMethod,
      },
    })(toggleSuperscript());

export const toggleSubscript: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { subsup } = state.schema.marks;
    if (subsup) {
      return toggleMark(subsup, { type: 'sub' })(state, dispatch);
    }
    return false;
  };
};

export const toggleSubscriptWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUB,
      attributes: {
        inputMethod,
      },
    })(toggleSubscript());

export const toggleCode: ToggleMarkCommand = () => {
  return (state, dispatch) => {
    const { code } = state.schema.marks;
    if (code) {
      return toggleMark(code)(state, dispatch);
    }

    return false;
  };
};

export const toggleCodeWithAnalytics: ToggleMarkWithAnalyticsFactory =
  (editorAnalyticsAPI) =>
  ({ inputMethod }) =>
    withAnalytics(editorAnalyticsAPI, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
      attributes: {
        inputMethod,
      },
    })(toggleCode());
