import { ACTION, type EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type { Command } from '@atlaskit/editor-common/types';
import { redo, undo } from '@atlaskit/prosemirror-history';

import { attachInputMeta, attachInputMetaWithAnalytics } from './attach-input-meta';
import { InputSource } from './enums';

export const undoFromKeyboard: Command = attachInputMeta(InputSource.KEYBOARD)(undo);

export const redoFromKeyboard: Command = attachInputMeta(InputSource.KEYBOARD)(redo);

export const undoFromToolbar: Command = attachInputMeta(InputSource.TOOLBAR)(undo);

export const redoFromToolbar: Command = attachInputMeta(InputSource.TOOLBAR)(redo);

export const undoFromKeyboardWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.KEYBOARD, ACTION.UNDO_PERFORMED)(
		undo,
	);

export const redoFromKeyboardWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.KEYBOARD, ACTION.REDO_PERFORMED)(
		redo,
	);

export const undoFromToolbarWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.TOOLBAR, ACTION.UNDO_PERFORMED)(
		undo,
	);

export const redoFromToolbarWithAnalytics = (
	editorAnalyticsAPI: EditorAnalyticsAPI | undefined,
): Command =>
	attachInputMetaWithAnalytics(editorAnalyticsAPI)(InputSource.TOOLBAR, ACTION.REDO_PERFORMED)(
		redo,
	);
