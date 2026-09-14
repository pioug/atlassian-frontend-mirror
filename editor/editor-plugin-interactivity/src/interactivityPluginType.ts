import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { ContextIdentifierPlugin } from '@atlaskit/editor-plugin-context-identifier/contextIdentifierPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';

export type InteractivityPlugin = NextEditorPlugin<
	'interactivity',
	{
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<ContextIdentifierPlugin>,
			OptionalPlugin<EditorViewModePlugin>,
		];
	}
>;
