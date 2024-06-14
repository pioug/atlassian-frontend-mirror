import type {
	GetEditorFeatureFlags,
	LongPressSelectionPluginOptions,
} from '@atlaskit/editor-common/types';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions extends LongPressSelectionPluginOptions, PanelPluginConfig {}

export interface PanelPluginConfig {
	allowCustomPanel?: boolean;
	allowCustomPanelEdit?: boolean;
	getEditorFeatureFlags?: GetEditorFeatureFlags;
}

export type DomPanelAtrrs = {
	class: string;
	'data-panel-type': string;
	'data-testid'?: string;
	'data-panel-color'?: string;
	'data-panel-icon-id'?: string;
	'data-panel-icon-text'?: string;
	style: string;
};

export type EmojiInfo = {
	shortName: string;
	id: string;
};
