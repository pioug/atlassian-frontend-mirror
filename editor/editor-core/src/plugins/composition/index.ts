import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import createPlugin from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';

export type CompositionState = {
  isComposing: boolean;
};

const composition: NextEditorPlugin<
  'composition',
  {
    sharedState: CompositionState | undefined;
  }
> = () => {
  return {
    name: 'composition',
    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
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

export default composition;
