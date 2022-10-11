import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CardOptions } from '@atlaskit/editor-common/card';

export type PastePluginOptions = {
  plainTextPasteLinkification?: boolean;
  cardOptions?: CardOptions;
  sanitizePrivateContent?: boolean;
};

const pastePlugin = ({
  cardOptions,
  sanitizePrivateContent,
  plainTextPasteLinkification,
}: PastePluginOptions): EditorPlugin => ({
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
            plainTextPasteLinkification,
            cardOptions,
            sanitizePrivateContent,
            providerFactory,
          ),
      },
    ];
  },
});

export default pastePlugin;
