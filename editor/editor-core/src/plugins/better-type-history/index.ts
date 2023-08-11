import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import createPlugin from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';

export type BetterTypeHistoryAPI = {
  flagPasteEvent: (transaction: Transaction) => Transaction;
};

/**
 * This plugin is aiming to improve undo behaviour for some of our more custom applications, very specific text
 * paste events, splitting blocks of text, new lines.
 */
const betterTypeHistory: NextEditorPlugin<
  'betterTypeHistory',
  {
    actions: BetterTypeHistoryAPI;
  }
> = () => {
  return {
    name: 'betterTypeHistory',
    actions: {
      flagPasteEvent(tr) {
        tr.setMeta(pluginKey, true);
        return tr;
      },
    },
    pmPlugins() {
      return [
        {
          name: 'betterTypeHistory',
          plugin: () => createPlugin(),
        },
      ];
    },
  };
};

export default betterTypeHistory;
