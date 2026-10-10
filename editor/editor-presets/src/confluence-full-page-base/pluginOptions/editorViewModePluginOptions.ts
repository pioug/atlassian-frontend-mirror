import type {
	EditorViewModePluginOptions,
	ViewMode,
} from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';

interface Props {
	options: {
		viewMode: ViewMode | undefined;
	};
}

export function editorViewModePluginOptions({ options }: Props): EditorViewModePluginOptions {
	return {
		mode: options.viewMode,
	};
}
