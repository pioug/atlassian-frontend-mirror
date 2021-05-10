import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rule';

const imageUpload = (): EditorPlugin => ({
  name: 'imageUpload',

  pmPlugins() {
    return [
      {
        name: 'imageUpload',
        plugin: createPlugin,
      },
      {
        name: 'imageUploadInputRule',
        plugin: ({ schema, featureFlags }) =>
          inputRulePlugin(schema, featureFlags),
      },
    ];
  },
});

export default imageUpload;
