import { PluginKey, EditorState, Transaction } from 'prosemirror-state';

import { CustomAutoformatState, CustomAutoformatAction } from './types';

export const pluginKey = new PluginKey('customAutoformatPlugin');

export const getPluginState = (editorState: EditorState) =>
  pluginKey.getState(editorState) as CustomAutoformatState | undefined;

export const autoformatAction = (
  tr: Transaction,
  action: CustomAutoformatAction,
): Transaction => {
  return tr.setMeta(pluginKey, action);
};
