// eslint-disable-next-line @atlaskit/platform/no-barrel-entry-imports
import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';

type NumberedHeadingsSharedState = {
	enabled: boolean;
};

export type NumberedHeadingsPluginDependencies = [
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<ToolbarPlugin>,
];

export type InternalNumberedHeadingsPlugin = NextEditorPlugin<
	'numberedHeadings',
	{
		dependencies: NumberedHeadingsPluginDependencies;
		sharedState: NumberedHeadingsSharedState | undefined;
	}
>;

/** Public API; the toolbar's shared state is internal to this plugin. */
export type NumberedHeadingsPlugin = NextEditorPlugin<
	'numberedHeadings',
	{
		dependencies: NumberedHeadingsPluginDependencies;
		sharedState: undefined;
	}
>;
