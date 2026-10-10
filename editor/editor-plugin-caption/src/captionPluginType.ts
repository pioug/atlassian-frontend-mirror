import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';

export type CaptionPluginDependencies = [
	typeof analyticsPlugin,
	OptionalPlugin<EditorDisabledPlugin>,
];

export type CaptionPlugin = NextEditorPlugin<
	'caption',
	{
		dependencies: CaptionPluginDependencies;
	}
>;
