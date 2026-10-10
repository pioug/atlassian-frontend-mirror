import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls/blockControlsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPluginType';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled/editorDisabledPluginType';
import type { EditorViewModePlugin } from '@atlaskit/editor-plugin-editor-viewmode/editorViewmodePluginType';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline/guidelinePluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent/user-intent-plugin-type';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width/width-plugin-type';

import type {
	DeleteLayoutColumnOptions,
	DistributeLayoutColumnsOptions,
	InsertLayoutColumnOptions,
	InsertLayoutColumnsInputMethod,
	SetLayoutColumnValignOptions,
	ToggleLayoutColumnMenuOptions,
} from './pm-plugins/actions';
import type { LayoutState } from './pm-plugins/types';
import type { LayoutPluginOptions } from './types';

export type LayoutPluginDependencies = [
	DecorationsPlugin,
	SelectionPlugin,
	OptionalPlugin<AnalyticsPlugin>,
	OptionalPlugin<WidthPlugin>,
	OptionalPlugin<EditorDisabledPlugin>,
	OptionalPlugin<EditorViewModePlugin>,
	OptionalPlugin<GuidelinePlugin>,
	OptionalPlugin<InteractionPlugin>,
	OptionalPlugin<BlockControlsPlugin>,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
	OptionalPlugin<UserIntentPlugin>,
];

export type LayoutPlugin = NextEditorPlugin<
	'layout',
	{
		actions: {
			insertLayoutColumns: (inputMethod: InsertLayoutColumnsInputMethod) => Command;
		};
		commands: {
			deleteLayoutColumn: (options?: DeleteLayoutColumnOptions) => EditorCommand;
			distributeLayoutColumns: (options?: DistributeLayoutColumnsOptions) => EditorCommand;
			insertLayoutColumn: (options: InsertLayoutColumnOptions) => EditorCommand;
			setLayoutColumnDangerPreview: (show: boolean) => EditorCommand;
			setLayoutColumnValign: (options: SetLayoutColumnValignOptions) => EditorCommand;
			toggleLayoutColumnMenu: (options: ToggleLayoutColumnMenuOptions) => EditorCommand;
		};
		dependencies: LayoutPluginDependencies;
		pluginConfiguration: LayoutPluginOptions | undefined;
		sharedState: LayoutState | undefined;
	}
>;
