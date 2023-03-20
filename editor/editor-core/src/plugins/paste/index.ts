import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '@atlaskit/editor-common/card';

export type PastePluginOptions = {
  plainTextPasteLinkification?: boolean;
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

const pastePlugin: NextEditorPlugin<
  'paste',
  {
    pluginConfiguration: PastePluginOptions;
  }
> = ({ cardOptions, sanitizePrivateContent, plainTextPasteLinkification }) => ({
  name: 'paste',

  pmPlugins() {
    return [
      {
        name: 'paste',
        plugin: ({
          schema,
          providerFactory,
          dispatchAnalyticsEvent,
          dispatch,
        }) =>
          createPlugin(
            schema,
            dispatchAnalyticsEvent,
            dispatch,
            cardOptions,
            sanitizePrivateContent,
            providerFactory,
          ),
      },
    ];
  },
});

export default pastePlugin;
