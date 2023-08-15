import type { Command, NextEditorPlugin } from '@atlaskit/editor-common/types';

import { insertActionForToolbar } from './pm-plugins/commands-toolbar';
import inputRulePlugin from './pm-plugins/input-rule';
import { createPlugin } from './pm-plugins/main';
import { stateKey } from './pm-plugins/plugin-key';
import type { UploadHandlerReference } from './types';

type ImageUploadActions = {
  startUpload: () => Command;
};

type ImageUploadSharedState = {
  active: boolean;
  enabled: boolean;
  hidden: boolean;
};

export type ImageUploadPlugin = NextEditorPlugin<
  'imageUpload',
  {
    actions: ImageUploadActions;
    sharedState: ImageUploadSharedState | undefined;
  }
>;
export const imageUploadPlugin: ImageUploadPlugin = () => {
  let uploadHandlerReference: UploadHandlerReference = {
    current: null,
  };

  return {
    name: 'imageUpload',

    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }

      return stateKey.getState(editorState);
    },

    actions: {
      startUpload: (): Command =>
        insertActionForToolbar(uploadHandlerReference),
    },

    pmPlugins() {
      return [
        {
          name: 'imageUpload',
          plugin: createPlugin(uploadHandlerReference),
        },
        {
          name: 'imageUploadInputRule',
          plugin: ({ schema, featureFlags }) =>
            inputRulePlugin(schema, featureFlags),
        },
      ];
    },
  };
};
