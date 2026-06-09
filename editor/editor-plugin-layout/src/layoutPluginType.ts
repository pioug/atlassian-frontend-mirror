import type { Valign } from '@atlaskit/adf-schema/layout-column';
import type {
	Command,
	EditorCommand,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { BlockControlsPlugin } from '@atlaskit/editor-plugin-block-controls';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu';
import type { DecorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import type { EditorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';
import type { GuidelinePlugin } from '@atlaskit/editor-plugin-guideline';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry';
import type { UserIntentPlugin } from '@atlaskit/editor-plugin-user-intent';
import type { WidthPlugin } from '@atlaskit/editor-plugin-width';

import type {
	DistributeLayoutColumnsOptions,
	InsertLayoutColumnSide,
	InsertLayoutColumnsInputMethod,
	LayoutColumnActionInputMethod,
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
			deleteLayoutColumn: (inputMethod?: LayoutColumnActionInputMethod) => EditorCommand;
			distributeLayoutColumns: (options?: DistributeLayoutColumnsOptions) => EditorCommand;
			insertLayoutColumn: (
				side: InsertLayoutColumnSide,
				inputMethod?: LayoutColumnActionInputMethod,
			) => EditorCommand;
			setLayoutColumnDangerPreview: (show: boolean) => EditorCommand;
			setLayoutColumnValign: (valign: Valign) => EditorCommand;
			toggleLayoutColumnMenu: (options: ToggleLayoutColumnMenuOptions) => EditorCommand;
		};
		dependencies: LayoutPluginDependencies;
		pluginConfiguration: LayoutPluginOptions | undefined;
		sharedState: LayoutState | undefined;
	}
>;
