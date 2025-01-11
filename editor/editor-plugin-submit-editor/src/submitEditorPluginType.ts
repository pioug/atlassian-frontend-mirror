import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type SubmitEditorPluginOptions = (editorView: EditorView) => void;

export type SubmitEditorPluginDependencies = [OptionalPlugin<MediaPlugin>];

export type SubmitEditorPlugin = NextEditorPlugin<
	'submitEditor',
	{
		pluginConfiguration: SubmitEditorPluginOptions | undefined;
		dependencies: SubmitEditorPluginDependencies;
	}
>;
