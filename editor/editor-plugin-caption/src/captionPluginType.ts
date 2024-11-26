import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';

export type CaptionPlugin = NextEditorPlugin<
	'caption',
	{
		dependencies: [typeof analyticsPlugin, OptionalPlugin<EditorDisabledPlugin>];
	}
>;
