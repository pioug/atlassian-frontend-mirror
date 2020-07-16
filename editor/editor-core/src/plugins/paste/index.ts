import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '../card';

export type PastePluginOptions = {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

const pastePlugin = ({
  cardOptions,
  sanitizePrivateContent,
}: PastePluginOptions): EditorPlugin => ({
  name: 'paste',

  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({ schema, providerFactory }) =>
          createPlugin(
            schema,
            cardOptions,
            sanitizePrivateContent,
            providerFactory,
          ),
      },
    ];
  },
});

export default pastePlugin;
