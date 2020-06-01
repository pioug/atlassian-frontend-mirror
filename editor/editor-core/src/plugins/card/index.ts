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
): EditorPlugin => ({
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
    return [{ name: 'card', plugin: createPlugin(!!isMobile) }];
  },

  pluginsOptions: {
    floatingToolbar: floatingToolbar(options),
  },
});

export default cardPlugin;
