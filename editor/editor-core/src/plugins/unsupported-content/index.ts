import {
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  unsupportedBlock,
  unsupportedInline,
} from '@atlaskit/adf-schema';
import { UnsupportedBlock, UnsupportedInline } from '@atlaskit/editor-common';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin, PMPluginFactory } from '../../types';
import { ReactNodeView } from '../../nodeviews';
import { traverseNode } from './utils';

export const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin: PMPluginFactory = ({
  schema,
  portalProviderAPI,
  eventDispatcher,
}) => {
  return new Plugin({
    state: {
      init(_config, state: EditorState) {
        traverseNode(state.doc, schema);
      },
      apply(_tr, pluginState) {
        return pluginState;
      },
    },
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: ReactNodeView.fromComponent(
          UnsupportedBlock,
          portalProviderAPI,
          eventDispatcher,
        ),
        confluenceUnsupportedInline: ReactNodeView.fromComponent(
          UnsupportedInline,
          portalProviderAPI,
          eventDispatcher,
        ),
        unsupportedBlock: ReactNodeView.fromComponent(
          UnsupportedBlock,
          portalProviderAPI,
          eventDispatcher,
        ),
        unsupportedInline: ReactNodeView.fromComponent(
          UnsupportedInline,
          portalProviderAPI,
          eventDispatcher,
        ),
      },
    },
  });
};

const unsupportedContentPlugin = (): EditorPlugin => ({
  name: 'unsupportedContent',

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
