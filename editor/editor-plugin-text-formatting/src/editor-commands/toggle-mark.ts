import {
	ACTION,
	ACTION_SUBJECT,
	ACTION_SUBJECT_ID,
	EVENT_TYPE,
} from '@atlaskit/editor-common/analytics/types/enums';
import { toggleMark } from '@atlaskit/editor-common/mark/commands';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MarkType } from '@atlaskit/editor-prosemirror/model';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { TextFormattingPlugin } from '../textFormattingPluginType';
import type { ToggleMarkWithAnalyticsEditorCommand } from './types';
import { nextToggleMark } from './utils/marks';

/**
 * Toggles a text style mark. Behind `platform_editor_style_around_inline_code` it uses the
 * package's own toggle, which can remove a style from a selection that also contains text
 * excluding it (such as inline code).
 */
const toggleStyleMark = (
	markType: MarkType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attrs?: { [key: string]: any },
): EditorCommand => {
	if (fg('platform_editor_style_around_inline_code')) {
		return nextToggleMark(markType, undefined, attrs);
	}
	return toggleMark(markType, attrs);
};

export const toggleEm: EditorCommand = ({ tr }) => {
	const { em } = tr.doc.type.schema.marks;
	if (!em) {
		// No transaction to apply
		return null;
	}
	return toggleStyleMark(em)({ tr });
};

export const toggleEmWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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
	return toggleStyleMark(strike)({ tr });
};

export const toggleStrikeWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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
	return toggleStyleMark(strong)({ tr });
};

export const toggleStrongWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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
	return toggleStyleMark(underline)({ tr });
};

export const toggleUnderlineWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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
	return toggleStyleMark(subsup, { type: 'sup' })({ tr });
};

export const toggleSuperscriptWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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
	return toggleStyleMark(subsup, { type: 'sub' })({ tr });
};

export const toggleSubscriptWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi) =>
	(inputMethod) =>
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

export const toggleCode =
	({ api }: { api: ExtractInjectionAPI<TextFormattingPlugin> | undefined }): EditorCommand =>
	({ tr }) => {
		const { code } = tr.doc.type.schema.marks;
		if (!code) {
			// No transaction to apply
			return null;
		}
		return nextToggleMark(code, api)({ tr });
	};

export const toggleCodeWithAnalytics: ToggleMarkWithAnalyticsEditorCommand =
	(editorAnalyticsApi, api) =>
	(inputMethod) =>
	({ tr }) => {
		const newTr = toggleCode({ api })({ tr });
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
