import { caption } from '@atlaskit/adf-schema';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { default as createCaptionPlugin } from './pm-plugins/main';
import { captionKeymap } from './pm-plugins/keymap';
import type { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';

const captionPlugin: NextEditorPlugin<
  'caption',
  { dependencies: [typeof analyticsPlugin] }
> = (_, api) => {
  return {
    name: 'caption',

    nodes() {
      return [{ name: 'caption', node: caption }];
    },

    pmPlugins() {
      return [
        {
          name: 'caption',
          plugin: ({
            portalProviderAPI,
            providerFactory,
            eventDispatcher,
            dispatch,
          }) =>
            createCaptionPlugin(
              portalProviderAPI,
              eventDispatcher,
              providerFactory,
              dispatch,
              api,
            ),
        },
        {
          name: 'captionKeymap',
          plugin: captionKeymap,
        },
      ];
    },
  };
};

export default captionPlugin;
