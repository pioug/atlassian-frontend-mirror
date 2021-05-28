import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '@atlaskit/editor-common';

export type PastePluginOptions = {
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
  predictableLists?: boolean;
};

const pastePlugin = ({
  cardOptions,
  sanitizePrivateContent,
  predictableLists,
}: PastePluginOptions): EditorPlugin => ({
  name: 'paste',

  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({ schema, providerFactory, dispatchAnalyticsEvent }) =>
          createPlugin(
            schema,
            dispatchAnalyticsEvent,
            cardOptions,
            sanitizePrivateContent,
            predictableLists,
            providerFactory,
          ),
      },
    ];
  },
});

export default pastePlugin;
