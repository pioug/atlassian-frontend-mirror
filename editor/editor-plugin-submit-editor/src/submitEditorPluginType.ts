import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { MediaPlugin } from '@atlaskit/editor-plugin-media/media-plugin-type';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export type SubmitEditorPluginOptions = (editorView: EditorView) => void;

export type SubmitEditorPluginDependencies = [OptionalPlugin<MediaPlugin>];

export type SubmitEditorPlugin = NextEditorPlugin<
	'submitEditor',
	{
		dependencies: SubmitEditorPluginDependencies;
		pluginConfiguration: SubmitEditorPluginOptions | undefined;
	}
>;
