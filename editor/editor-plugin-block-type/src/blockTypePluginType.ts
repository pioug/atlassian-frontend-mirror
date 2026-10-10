import type { Command } from '@atlaskit/editor-common/types/command';
import type { EditorCommand } from '@atlaskit/editor-common/types/editor-command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPluginType';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { InteractionPlugin } from '@atlaskit/editor-plugin-interaction/interaction-plugin-type';
import type { ListPlugin } from '@atlaskit/editor-plugin-list/list-plugin-type';
import type { PrimaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar/primary-toolbar-plugin-type';
import type { SelectionToolbarPlugin } from '@atlaskit/editor-plugin-selection-toolbar/selection-toolbar-plugin-type';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import type { UserPreferencesPlugin } from '@atlaskit/editor-plugin-user-preferences/user-preferences-plugin-type';

import type { TextBlockTypes } from './pm-plugins/block-types';
import type { ClearFormattingInputMethod, InputMethod } from './pm-plugins/commands/block-type';
import type { BlockTypeState } from './pm-plugins/main';
import type { BlockTypePluginOptions } from './pm-plugins/types';

export type BlockTypePlugin = NextEditorPlugin<
	'blockType',
	{
		actions: {
			insertBlockQuote: (inputMethod: InputMethod) => Command;
		};
		commands: {
			clearFormatting: (inputMethod: ClearFormattingInputMethod) => EditorCommand;
			insertBlockQuote: (inputMethod: InputMethod) => EditorCommand;
			setTextLevel: (
				level: TextBlockTypes,
				inputMethod: InputMethod,
				fromBlockQuote?: boolean,
			) => EditorCommand;
		};
		dependencies: [
			OptionalPlugin<AnalyticsPlugin>,
			OptionalPlugin<PrimaryToolbarPlugin>,
			OptionalPlugin<SelectionToolbarPlugin>,
			OptionalPlugin<UserPreferencesPlugin>,
			OptionalPlugin<ToolbarPlugin>,
			OptionalPlugin<BlockMenuPlugin>,
			OptionalPlugin<ListPlugin>,
			OptionalPlugin<SelectionPlugin>,
			OptionalPlugin<InteractionPlugin>,
			OptionalPlugin<UiControlRegistryPlugin>,
		];
		pluginConfiguration: BlockTypePluginOptions | undefined;
		sharedState: BlockTypeState | undefined;
	}
>;
