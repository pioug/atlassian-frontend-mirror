import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	INPUT_METHOD,
} from '@atlaskit/editor-common/analytics';
import { withAnalytics } from '@atlaskit/editor-common/editor-analytics';
import type { HigherOrderCommand, Command } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { InputSource } from './enums';
import { pluginKey as undoPluginKey } from './plugin-key';

type AttachInputMeta = (inputSource: InputSource) => HigherOrderCommand;
export const attachInputMeta: AttachInputMeta = (inputSource) => (command) => (state, dispatch) => {
	let customTr: Transaction = state.tr;
	const fakeDispatch = (tr: Transaction) => {
		customTr = tr;
	};
	command(state, fakeDispatch);

	if (!customTr || !customTr.docChanged) {
		return false;
	}

	customTr.setMeta(undoPluginKey, inputSource);
	if (dispatch) {
		dispatch(customTr);
	}

	return true;
};

const inputSourceToInputMethod = (
	inputSource: InputSource,
): INPUT_METHOD.KEYBOARD | INPUT_METHOD.TOOLBAR | INPUT_METHOD.EXTERNAL => {
	switch (inputSource) {
		case InputSource.EXTERNAL:
			return INPUT_METHOD.EXTERNAL;
		case InputSource.KEYBOARD:
			return INPUT_METHOD.KEYBOARD;
		case InputSource.TOOLBAR:
			return INPUT_METHOD.TOOLBAR;
		default:
			return INPUT_METHOD.EXTERNAL;
	}
};

export const attachInputMetaWithAnalytics =
	(editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	(inputSource: InputSource, action: ACTION.UNDO_PERFORMED | ACTION.REDO_PERFORMED) =>
	(command: Command) =>
		attachInputMeta(inputSource)(
			withAnalytics(editorAnalyticsAPI, {
				eventType: EVENT_TYPE.TRACK,
				action,
				actionSubject: ACTION_SUBJECT.EDITOR,
				attributes: {
					inputMethod: inputSourceToInputMethod(inputSource),
				},
			})(command),
		);
