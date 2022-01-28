import { PluginKey } from 'prosemirror-state';
import { LongPressSelectionPluginOptions } from '../selection/types';

export const pluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions
  extends LongPressSelectionPluginOptions,
    PanelPluginConfig {}

export interface PanelPluginConfig {
  allowCustomPanel?: boolean;
  allowCustomPanelEdit?: boolean;
}

export type DomPanelAtrrs = {
  class: string;
  'data-panel-type': string;
  'data-panel-color'?: string;
  'data-panel-icon-id'?: string;
  'data-panel-icon-text'?: string;
  style: string;
};

export type EmojiInfo = {
  shortName: string;
  id: string;
};
