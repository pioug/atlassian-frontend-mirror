import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { toggleMark } from '@atlaskit/editor-common/mark';
import type {
  EditorCommand,
  InputMethodBasic,
} from '@atlaskit/editor-common/types';

type ToggleMarkWithAnalyticsEditorCommand = (
  editorAnalyticsApi: EditorAnalyticsAPI | undefined,
) => ToggleMarkEditorCommand;

export type ToggleMarkEditorCommand = (
  inputMethod: InputMethodBasic,
) => EditorCommand;

export const toggleEm: EditorCommand = ({ tr }) => {
  const { em } = tr.doc.type.schema.marks;
  if (!em) {
    // No transaction to apply
    return null;
  }
  return toggleMark(em)({ tr });
};

export const toggleEmWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
  editorAnalyticsApi =>
  inputMethod =>
  ({ tr }) => {
    const newTr = toggleEm({ tr });
    if (!newTr) {
      // No transaction to apply
      return null;
    }

    editorAnalyticsApi?.attachAnalyticsEvent({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
      attributes: {
        inputMethod,
      },
    })(newTr);

    return newTr;
  };

export const toggleStrike: EditorCommand = ({ tr }) => {
  const { strike } = tr.doc.type.schema.marks;
  if (!strike) {
    // No transaction to apply
    return null;
  }
  return toggleMark(strike)({ tr });
};

export const toggleStrikeWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
  editorAnalyticsApi =>
  inputMethod =>
  ({ tr }) => {
    const newTr = toggleStrike({ tr });
    if (!newTr) {
      // No transaction to apply
      return null;
    }

    editorAnalyticsApi?.attachAnalyticsEvent({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
      attributes: {
        inputMethod,
      },
    })(newTr);

    return newTr;
  };

export const toggleStrong: EditorCommand = ({ tr }) => {
  const { strong } = tr.doc.type.schema.marks;
  if (!strong) {
    // No transaction to apply
    return null;
  }
  return toggleMark(strong)({ tr });
};

export const toggleStrongWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
  editorAnalyticsApi =>
  inputMethod =>
  ({ tr }) => {
    const newTr = toggleStrong({ tr });
    if (!newTr) {
      // No transaction to apply
      return null;
    }

    editorAnalyticsApi?.attachAnalyticsEvent({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
      attributes: {
        inputMethod,
      },
    })(newTr);

    return newTr;
  };

export const toggleUnderline: EditorCommand = ({ tr }) => {
  const { underline } = tr.doc.type.schema.marks;
  if (!underline) {
    // No transaction to apply
    return null;
  }
  return toggleMark(underline)({ tr });
};

export const toggleUnderlineWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =

    editorAnalyticsApi =>
    inputMethod =>
    ({ tr }) => {
      const newTr = toggleUnderline({ tr });
      if (!newTr) {
        // No transaction to apply
        return null;
      }

      editorAnalyticsApi?.attachAnalyticsEvent({
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
        attributes: {
          inputMethod,
        },
      })(newTr);

      return newTr;
    };

export const toggleSuperscript: EditorCommand = ({ tr }) => {
  const { subsup } = tr.doc.type.schema.marks;
  if (!subsup) {
    // No transaction to apply
    return null;
  }
  return toggleMark(subsup, { type: 'sup' })({ tr });
};

export const toggleSuperscriptWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =

    editorAnalyticsApi =>
    inputMethod =>
    ({ tr }) => {
      const newTr = toggleSuperscript({ tr });
      if (!newTr) {
        // No transaction to apply
        return null;
      }

      editorAnalyticsApi?.attachAnalyticsEvent({
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUPER,
        attributes: {
          inputMethod,
        },
      })(newTr);

      return newTr;
    };

export const toggleSubscript: EditorCommand = ({ tr }) => {
  const { subsup } = tr.doc.type.schema.marks;
  if (!subsup) {
    // No transaction to apply
    return null;
  }
  return toggleMark(subsup, { type: 'sub' })({ tr });
};

export const toggleSubscriptWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =

    editorAnalyticsApi =>
    inputMethod =>
    ({ tr }) => {
      const newTr = toggleSubscript({ tr });
      if (!newTr) {
        // No transaction to apply
        return null;
      }

      editorAnalyticsApi?.attachAnalyticsEvent({
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_SUB,
        attributes: {
          inputMethod,
        },
      })(newTr);

      return newTr;
    };

export const toggleCode: EditorCommand = ({ tr }) => {
  const { code } = tr.doc.type.schema.marks;
  if (!code) {
    // No transaction to apply
    return null;
  }
  return toggleMark(code)({ tr });
};

export const toggleCodeWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
  editorAnalyticsApi =>
  inputMethod =>
  ({ tr }) => {
    const newTr = toggleCode({ tr });
    if (!newTr) {
      // No transaction to apply
      return null;
    }

    editorAnalyticsApi?.attachAnalyticsEvent({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
      attributes: {
        inputMethod,
      },
    })(newTr);

    return newTr;
  };
