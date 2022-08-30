import { EditorState, PluginKey } from 'prosemirror-state';
import { TablePluginState } from '../types';

export const pluginKey = new PluginKey<TablePluginState>('nextTablePlugin');
export const getPluginState = (
  state: EditorState,
): TablePluginState | undefined | null => state && pluginKey.getState(state);
