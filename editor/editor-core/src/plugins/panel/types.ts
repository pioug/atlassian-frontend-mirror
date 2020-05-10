import { PluginKey } from 'prosemirror-state';

export const pluginKey = new PluginKey('panelPlugin');

export interface PanelPluginOptions {
  allowSelection?: boolean;
}
