import { Plugin, PluginKey } from 'prosemirror-state';

import {
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  unsupportedBlock,
  unsupportedInline,
  unsupportedMark,
  unsupportedNodeAttribute,
} from '@atlaskit/adf-schema';

import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common';

import { ReactNodeView } from '../../nodeviews';
import { EditorPlugin, PMPluginFactory } from '../../types';

export const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin: PMPluginFactory = ({
  portalProviderAPI,
  eventDispatcher,
  dispatchAnalyticsEvent,
}) => {
  return new Plugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: ReactNodeView.fromComponent(
          UnsupportedBlock,
          portalProviderAPI,
          eventDispatcher,
          { dispatchAnalyticsEvent },
        ),
        confluenceUnsupportedInline: ReactNodeView.fromComponent(
          UnsupportedInline,
          portalProviderAPI,
          eventDispatcher,
          { dispatchAnalyticsEvent },
        ),
        unsupportedBlock: ReactNodeView.fromComponent(
          UnsupportedBlock,
          portalProviderAPI,
          eventDispatcher,
          { dispatchAnalyticsEvent },
        ),
        unsupportedInline: ReactNodeView.fromComponent(
          UnsupportedInline,
          portalProviderAPI,
          eventDispatcher,
          { dispatchAnalyticsEvent },
        ),
      },
    },
  });
};

const unsupportedContentPlugin = (): EditorPlugin => ({
  name: 'unsupportedContent',

  marks() {
    return [
      { name: 'unsupportedMark', mark: unsupportedMark },
      { name: 'unsupportedNodeAttribute', mark: unsupportedNodeAttribute },
    ];
  },

  nodes() {
    return [
      {
        name: 'confluenceUnsupportedBlock',
        node: confluenceUnsupportedBlock,
      },
      {
        name: 'confluenceUnsupportedInline',
        node: confluenceUnsupportedInline,
      },
      {
        name: 'unsupportedBlock',
        node: unsupportedBlock,
      },
      {
        name: 'unsupportedInline',
        node: unsupportedInline,
      },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'unsupportedContent',
        plugin: createPlugin,
      },
    ];
  },
});

export default unsupportedContentPlugin;
