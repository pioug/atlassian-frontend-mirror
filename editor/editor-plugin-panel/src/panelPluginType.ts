import { type INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import type {
	Command,
	LongPressSelectionPluginOptions,
	NextEditorPlugin,
	OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';
import { type EmojiPlugin } from '@atlaskit/editor-plugin-emoji';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions extends LongPressSelectionPluginOptions, PanelPluginConfig {}

export interface PanelPluginConfig {
	allowCustomPanel?: boolean;
	allowCustomPanelEdit?: boolean;
}

export type DomPanelAtrrs = {
	class: string;
	'data-panel-color'?: string;
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
	EmojiPlugin,
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
