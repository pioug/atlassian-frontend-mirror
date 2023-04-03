import { caption } from '@atlaskit/adf-schema';
import { NextEditorPlugin } from '@atlaskit/editor-common/types';
import { default as createCaptionPlugin } from './pm-plugins/main';
import { captionKeymap } from './pm-plugins/keymap';

const captionPlugin: NextEditorPlugin<'caption'> = () => {
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
          }) => {
            return createCaptionPlugin(
              portalProviderAPI,
              eventDispatcher,
              providerFactory,
              dispatch,
            );
          },
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
