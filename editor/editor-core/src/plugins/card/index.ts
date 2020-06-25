import { PluginKey } from 'prosemirror-state';
import { inlineCard, blockCard, embedCard } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { CardOptions } from './types';

export { CardOptions } from './types';

export const stateKey = new PluginKey('cardPlugin');

const cardPlugin = (
  options: CardOptions,
  isMobile?: boolean,
  fullWidthMode?: boolean,
): EditorPlugin => {
  const platform = isMobile ? 'mobile' : 'web';
  return {
    name: 'card',

    nodes() {
      const nodes = [
        { name: 'inlineCard', node: inlineCard },
        { name: 'blockCard', node: blockCard },
      ];

      if (options.allowEmbeds) {
        nodes.push({
          name: 'embedCard',
          node: embedCard,
        });
      }

      return nodes;
    },

    pmPlugins() {
      const allowResizing =
        typeof options.allowResizing === 'boolean'
          ? options.allowResizing
          : true;
      return [
        {
          name: 'card',
          plugin: createPlugin(platform, allowResizing, fullWidthMode),
        },
      ];
    },

    pluginsOptions: {
      floatingToolbar: floatingToolbar(options, platform),
    },
  };
};

export default cardPlugin;
