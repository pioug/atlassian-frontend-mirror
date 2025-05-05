import { ACTION, EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { redo, undo } from '@atlaskit/editor-prosemirror/history';

import { attachInputMeta, attachInputMetaWithAnalytics } from './attach-input-meta';
import { InputSource } from './enums';

export const undoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(undo);

export const redoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(redo);

export const undoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(undo);

export const redoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(redo);

export const undoFromToolbarWithAnalytics = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.TOOLBAR, ACTION.UNDO_PERFORMED)(
		undo,
	);

export const redoFromToolbarWithAnalytics = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.TOOLBAR, ACTION.REDO_PERFORMED)(
		redo,
	);
