import type { Command, ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { UndoRedoPlugin } from '../undoRedoPluginType';

export const closeTypeAheadAndRunCommand =
	(editorView: EditorView, api: ExtractInjectionAPI<UndoRedoPlugin> | undefined) =>
	(command: Command): boolean => {
		if (!editorView) {
			return false;
		}
		if (api?.typeAhead?.actions?.isOpen(editorView.state)) {
			api?.typeAhead?.actions?.close({
				attachCommand: command,
				insertCurrentQueryAsRawText: false,
			});
		} else {
			command(editorView.state, editorView.dispatch);
		}
		return true;
	};
export const forceFocus =
	(editorView: EditorView, api: ExtractInjectionAPI<UndoRedoPlugin> | undefined) =>
	(command: Command): boolean => {
		const result = closeTypeAheadAndRunCommand(editorView, api)(command);

		if (result && !editorView.hasFocus()) {
			editorView.focus();
		}
		return result;
	};
