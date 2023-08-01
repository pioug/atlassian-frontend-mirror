import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { Dispatch } from '../../../event-dispatcher';
import { isAlignable } from '../commands';
import { getActiveAlignment } from '../utils';
import type { AlignmentPluginState } from './types';

export function createInitialPluginState(
  editorState: EditorState,
  pluginConfig: AlignmentPluginState,
): AlignmentPluginState {
  return {
    align: getActiveAlignment(editorState) || pluginConfig.align,
    isEnabled: true,
  };
}

export const pluginKey = new PluginKey<AlignmentPluginState>('alignmentPlugin');

export function createPlugin(
  dispatch: Dispatch,
  pluginConfig: AlignmentPluginState,
): SafePlugin {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply(_tr, state: AlignmentPluginState, _prevState, nextState) {
        const nextPluginState = getActiveAlignment(nextState)!;
        const isEnabled = isAlignable(nextPluginState)(nextState);
        const newState = {
          ...state,
          align: nextPluginState,
          isEnabled,
        };
        if (nextPluginState !== state.align || isEnabled !== state.isEnabled) {
          dispatch(pluginKey, newState);
        }
        return newState;
      },
    },
  });
}
