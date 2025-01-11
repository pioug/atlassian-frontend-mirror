import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

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
