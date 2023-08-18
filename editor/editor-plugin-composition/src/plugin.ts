import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import createPlugin from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';

export type CompositionState = {
  isComposing: boolean;
};

export type CompositionPlugin = NextEditorPlugin<
  'composition',
  {
    sharedState: CompositionState;
  }
>;

export const compositionPlugin: CompositionPlugin = () => {
  return {
    name: 'composition',
    getSharedState(editorState) {
      if (!editorState) {
        return {
          isComposing: false,
        };
      }
      return {
        isComposing: !!pluginKey.getState(editorState)?.isComposing,
      };
    },
    pmPlugins() {
      return [
        {
          name: 'composition',
          plugin: () => createPlugin(),
        },
      ];
    },
  };
};
