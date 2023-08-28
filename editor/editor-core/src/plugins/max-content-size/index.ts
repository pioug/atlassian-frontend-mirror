import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Dispatch } from '../../event-dispatcher';

export const pluginKey = new PluginKey<MaxContentSizePluginState>(
  'maxContentSizePlugin',
);

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };

export function createPlugin(
  dispatch: Dispatch,
  maxContentSize?: number,
): SafePlugin | undefined {
  if (!maxContentSize) {
    return;
  }

  let maxContentSizeReached = false;

  return new SafePlugin({
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

const maxContentSizePlugin: NextEditorPlugin<
  'maxContentSize',
  {
    pluginConfiguration: number | undefined;
  }
> = ({ config: maxContentSize }) => ({
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
