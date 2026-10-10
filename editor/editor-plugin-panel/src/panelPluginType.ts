import type { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import type { Command } from '@atlaskit/editor-common/types/command';
import type {
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types/next-editor-plugin';
import type { LongPressSelectionPluginOptions } from '@atlaskit/editor-common/types/selection';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics/analyticsPlugin';
import type { BlockMenuPlugin } from '@atlaskit/editor-plugin-block-menu/blockMenuPluginType';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations/decorationsPlugin';
import type { EmojiPlugin } from '@atlaskit/editor-plugin-emoji/emojiPluginType';
import type { SelectionPlugin } from '@atlaskit/editor-plugin-selection/selection-plugin-type';
import type { ToolbarPlugin } from '@atlaskit/editor-plugin-toolbar/toolbar-plugin-type';
import type { UiControlRegistryPlugin } from '@atlaskit/editor-plugin-ui-control-registry/ui-control-registry-plugin-type';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey: PluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions extends LongPressSelectionPluginOptions, PanelPluginConfig {}

export interface PanelPluginConfig {
	allowCustomPanel?: boolean;
	allowCustomPanelEdit?: boolean;
}

export type DomPanelAtrrs = {
	class: string;
	'data-local-id'?: string;
	'data-panel-color'?: string;
	'data-panel-icon'?: string;
	'data-panel-icon-id'?: string;
	'data-panel-icon-text'?: string;
	'data-panel-type': string;
	'data-testid'?: string;
	style: string;
};
export type EmojiInfo = {
	id: string;
	shortName: string;
};

export type PanelPluginDependencies = [
	typeof decorationsPlugin,
	OptionalPlugin<typeof analyticsPlugin>,
	OptionalPlugin<ToolbarPlugin>,
	EmojiPlugin,
	OptionalPlugin<BlockMenuPlugin>,
	OptionalPlugin<SelectionPlugin>,
	OptionalPlugin<UiControlRegistryPlugin>,
];

export type PanelPlugin = NextEditorPlugin<
	'panel',
	{
		actions: {
			insertPanel: (
				inputMethod: INPUT_METHOD.INSERT_MENU | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.TOOLBAR,
			) => Command;
		};
		dependencies: PanelPluginDependencies;
		pluginConfiguration: PanelPluginOptions | undefined;
	}
>;
