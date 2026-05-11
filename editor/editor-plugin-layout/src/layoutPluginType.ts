import type { NextEditorPlugin, OptionalPlugin } from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type {
	insertLayoutColumnsWithAnalytics,
	toggleLayoutColumnMenu,
} from './pm-plugins/actions';
import type { LayoutState } from './pm-plugins/types';
import type { LayoutPluginOptions } from './types';

export type LayoutPluginDependencies = [
	DecorationsPlugin,
	SelectionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<WidthPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<GuidelinePlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<ToolbarPlugin>,
];

export type LayoutPlugin = NextEditorPlugin<
	'layout',
	{
		actions: {
			insertLayoutColumns: ReturnType<typeof insertLayoutColumnsWithAnalytics>;
		};
		commands: {
			toggleLayoutColumnMenu: typeof toggleLayoutColumnMenu;
		};
		dependencies: LayoutPluginDependencies;
		pluginConfiguration: LayoutPluginOptions | undefined;
		sharedState: LayoutState | undefined;
	}
>;
