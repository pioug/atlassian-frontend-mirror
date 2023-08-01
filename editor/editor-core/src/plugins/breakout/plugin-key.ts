import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { BreakoutPluginState } from './types';

export const pluginKey = new PluginKey<BreakoutPluginState>('breakoutPlugin');
export const getPluginState = (
  state: EditorState,
): BreakoutPluginState | undefined => pluginKey.getState(state) || undefined;
