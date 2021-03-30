import { EditorState, PluginKey } from 'prosemirror-state';
import { BreakoutPluginState } from './types';

export const pluginKey = new PluginKey<BreakoutPluginState>('breakoutPlugin');
export const getPluginState = (state: EditorState): BreakoutPluginState =>
  pluginKey.getState(state);
