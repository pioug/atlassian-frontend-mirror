import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';

export type ContextMenuPlugin = NextEditorPlugin<
	'contextMenu',
	{
		dependencies: [OptionalPlugin<AnalyticsPlugin>];
	}
>;
