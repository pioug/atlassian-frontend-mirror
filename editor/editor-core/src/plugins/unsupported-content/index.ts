import {
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  unsupportedBlock,
  unsupportedInline,
} from '@atlaskit/adf-schema';
import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorPlugin, PMPluginFactory } from '../../types';
import { ReactNodeView } from '../../nodeviews';
import ReactUnsupportedBlockNode from './nodeviews/unsupported-block';
import ReactUnsupportedInlineNode from './nodeviews/unsupported-inline';
import { traverseNode } from './utils';

export const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin: PMPluginFactory = ({ schema, portalProviderAPI }) => {
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
          ReactUnsupportedBlockNode,
          portalProviderAPI,
        ),
        confluenceUnsupportedInline: ReactNodeView.fromComponent(
          ReactUnsupportedInlineNode,
          portalProviderAPI,
        ),
        unsupportedBlock: ReactNodeView.fromComponent(
          ReactUnsupportedBlockNode,
          portalProviderAPI,
        ),
        unsupportedInline: ReactNodeView.fromComponent(
          ReactUnsupportedInlineNode,
          portalProviderAPI,
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
