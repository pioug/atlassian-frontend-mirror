import { PluginKey } from 'prosemirror-state';
import { LongPressSelectionPluginOptions } from '../selection/types';

export const pluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions
  extends LongPressSelectionPluginOptions,
    PanelPluginConfig {}

export interface PanelPluginConfig {
  UNSAFE_allowCustomPanel?: boolean;
}
