import { PluginKey } from 'prosemirror-state';
import { inlineCard, blockCard } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { floatingToolbar } from './toolbar';
import { CardOptions } from './types';

export { CardOptions } from './types';

export const stateKey = new PluginKey('cardPlugin');

const cardPlugin = (options: CardOptions): EditorPlugin => ({
  name: 'card',

  nodes() {
    return [
      { name: 'inlineCard', node: inlineCard },
      { name: 'blockCard', node: blockCard },
    ];
  },

  pmPlugins() {
    return [{ name: 'card', plugin: createPlugin }];
  },

  pluginsOptions: {
    floatingToolbar: floatingToolbar(options),
  },
});

export default cardPlugin;
