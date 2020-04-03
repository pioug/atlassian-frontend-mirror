import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '../card';

const pastePlugin = ({
  cardOptions,
  sanitizePrivateContent,
}: {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
}): EditorPlugin => ({
  name: 'paste',

  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({ schema }) =>
          createPlugin(schema, cardOptions, sanitizePrivateContent),
      },
    ];
  },
});

export default pastePlugin;
