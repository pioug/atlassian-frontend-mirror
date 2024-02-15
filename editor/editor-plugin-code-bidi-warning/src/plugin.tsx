import type {
  EditorAppearance,
  NextEditorPlugin,
} from '@atlaskit/editor-common/types';

import { createPlugin } from './pm-plugins/main';

type Config = {
  appearance?: EditorAppearance;
};

export type CodeBidiWarningPlugin = NextEditorPlugin<
  'codeBidiWarning',
  {
    pluginConfiguration: Config | undefined;
  }
>;

export const codeBidiWarningPlugin: CodeBidiWarningPlugin = ({ config }) => ({
  name: 'codeBidiWarning',

  pmPlugins() {
    return [
      {
        name: 'codeBidiWarning',
        plugin: options => {
          return createPlugin(options, config ?? {});
        },
      },
    ];
  },
});
