import type { AnalyticsEventPayload, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
	PasteContents,
	PasteTypes,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type { Command } from '@atlaskit/editor-common/types';
import type { LastContentPasted } from '@atlaskit/editor-plugin-paste';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { PastePluginActionTypes as ActionTypes } from '../editor-actions/actions';
import { createCommand } from '../pm-plugins/plugin-factory';
import {
	formatMarkdown,
	formatPlainText,
	formatRichText,
} from '../pm-plugins/util/format-handlers';
import type { PasteOtionsPluginState } from '../types/types';
import { pasteOptionsPluginKey, ToolbarDropdownOption } from '../types/types';

export const showToolbar = (
	lastContentPasted: LastContentPasted,
	selectedOption: ToolbarDropdownOption,
): Command => {
	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.SHOW_PASTE_OPTIONS,
			data: {
				selectedOption,
				plaintext: lastContentPasted.text,
				isPlainText: lastContentPasted.isPlainText,
				richTextSlice: lastContentPasted.pastedSlice,
				pasteStartPos: lastContentPasted.pasteStartPos,
				pasteEndPos: lastContentPasted.pasteEndPos,
			},
		};
	};

	return createCommand(commandAction);
};

export const changeToPlainText = (): Command => {
	const plaintextTransformer = (tr: Transaction, state: EditorState) => {
		const pluginState: PasteOtionsPluginState = pasteOptionsPluginKey.getState(state);
		if (pluginState.selectedOption === ToolbarDropdownOption.PlainText) {
			return tr;
		}

		return formatPlainText(tr, pluginState);
	};
	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.CHANGE_FORMAT,
			data: {
				selectedOption: ToolbarDropdownOption.PlainText,
			},
		};
	};
	return createCommand(commandAction, plaintextTransformer);
};

export const changeToPlainTextWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined, sliceSize: number) => (): Command => {
		return withAnalytics(editorAnalyticsAPI, {
			action: ACTION.PASTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.TOOLBAR,
				type: PasteTypes.plain,
				content: PasteContents.text,
				pasteSize: sliceSize,
			},
		})(changeToPlainText());
	};

export const dropdownClickHandler = (): Command => {
	return highlightContent();
};

export const changeToRichText = (): Command => {
	const transformer = (tr: Transaction, state: EditorState) => {
		const pluginState: PasteOtionsPluginState = pasteOptionsPluginKey.getState(state);
		if (pluginState.selectedOption === ToolbarDropdownOption.RichText) {
			return tr;
		}

		return formatRichText(tr, pluginState);
	};
	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.CHANGE_FORMAT,
			data: {
				selectedOption: ToolbarDropdownOption.RichText,
			},
		};
	};
	return createCommand(commandAction, transformer);
};

export const changeToRichTextWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => (): Command => {
		const payloadCallback = (state: EditorState): AnalyticsEventPayload | undefined => {
			const pastePluginState = pasteOptionsPluginKey.getState(state) as PasteOtionsPluginState;

			return {
				action: ACTION.PASTED,
				actionSubject: ACTION_SUBJECT.DOCUMENT,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					inputMethod: INPUT_METHOD.TOOLBAR,
					type: PasteTypes.richText,
					content: PasteContents.text,
					pasteSize: pastePluginState.richTextSlice?.size || 0,
				},
			};
		};

		return withAnalytics(editorAnalyticsAPI, payloadCallback)(changeToRichText());
	};

export const changeToMarkDown = (): Command => {
	const markdownTransformer = (tr: Transaction, state: EditorState) => {
		const pluginState: PasteOtionsPluginState = pasteOptionsPluginKey.getState(state);
		if (pluginState.selectedOption === ToolbarDropdownOption.Markdown) {
			return tr;
		}

		return formatMarkdown(tr, pluginState);
	};

	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.CHANGE_FORMAT,
			data: {
				selectedOption: ToolbarDropdownOption.Markdown,
			},
		};
	};
	return createCommand(commandAction, markdownTransformer);
};

export const changeToMarkdownWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined, sliceSize: number) => (): Command => {
		return withAnalytics(editorAnalyticsAPI, {
			action: ACTION.PASTED,
			actionSubject: ACTION_SUBJECT.DOCUMENT,
			eventType: EVENT_TYPE.TRACK,
			attributes: {
				inputMethod: INPUT_METHOD.TOOLBAR,
				type: PasteTypes.markdown,
				content: PasteContents.text,
				pasteSize: sliceSize,
			},
		})(changeToMarkDown());
	};

export const highlightContent = (): Command => {
	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.HIGHLIGHT_CONTENT,
		};
	};
	return createCommand(commandAction);
};

export const hideToolbar = (): Command => {
	const commandAction = (editorState: EditorState) => {
		return {
			type: ActionTypes.HIDE_PASTE_OPTIONS,
		};
	};

	return createCommand(commandAction);
};

export const checkAndHideToolbar = (view: EditorView): void => {
	const pluginState = pasteOptionsPluginKey.getState(view.state);
	if (pluginState.showToolbar) {
		hideToolbar()(view.state, view.dispatch);
	}
};
