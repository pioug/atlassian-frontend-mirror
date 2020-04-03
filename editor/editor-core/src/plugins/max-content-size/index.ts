import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey('maxContentSizePlugin');

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };

export function createPlugin(
  dispatch: Dispatch,
  maxContentSize?: number,
): Plugin | undefined {
  if (!maxContentSize) {
    return;
  }

  let maxContentSizeReached = false;

  return new Plugin({
    filterTransaction(tr: Transaction): boolean {
      const result = tr.doc && tr.doc.nodeSize > maxContentSize;

      if (result || result !== maxContentSizeReached) {
        dispatch(pluginKey, { maxContentSizeReached: result });
      }

      maxContentSizeReached = result;
      return !result;
    },
  });
}

const maxContentSizePlugin = (maxContentSize?: number): EditorPlugin => ({
  name: 'maxContentSize',

  pmPlugins() {
    return [
      {
        name: 'maxContentSize',
        plugin: ({ dispatch }) => createPlugin(dispatch, maxContentSize),
      },
    ];
  },
});

export default maxContentSizePlugin;
