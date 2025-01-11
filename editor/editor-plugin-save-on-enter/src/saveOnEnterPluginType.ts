import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type Config = (editorView: EditorView) => void;

export type SaveOnEnterPlugin = NextEditorPlugin<
	'saveOnEnter',
	{
		pluginConfiguration: Config | undefined;
	}
>;
