import { EditorState, PluginKey } from 'prosemirror-state';

export const pluginKey = new PluginKey('breakoutPlugin');
export const getPluginState = (state: EditorState) => pluginKey.getState(state);
