import type {
  EditorState,
  Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

import type { CustomAutoformatState, CustomAutoformatAction } from './types';

export const pluginKey = new PluginKey('customAutoformatPlugin');

export const getPluginState = (editorState: EditorState) =>
  pluginKey.getState(editorState) as CustomAutoformatState | undefined;

export const autoformatAction = (
  tr: Transaction,
  action: CustomAutoformatAction,
): Transaction => {
  return tr.setMeta(pluginKey, action);
};
