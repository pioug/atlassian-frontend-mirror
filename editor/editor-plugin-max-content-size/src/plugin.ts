import type { Dispatch } from '@atlaskit/editor-common/event-dispatcher';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { NextEditorPlugin } from '@atlaskit/editor-common/types';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';

export const pluginKey = new PluginKey<MaxContentSizePluginState>(
  'maxContentSizePlugin',
);

export type MaxContentSizePluginState = { maxContentSizeReached: boolean };
export type MaxContentSizePlugin = NextEditorPlugin<
  'maxContentSize',
  {
    sharedState: MaxContentSizePluginState | undefined;
    pluginConfiguration: number | undefined;
  }
>;

export function createPlugin(
  dispatch: Dispatch,
  maxContentSize?: number,
): SafePlugin | undefined {
  if (!maxContentSize) {
    return;
  }

  let maxContentSizeReached = false;

  return new SafePlugin({
    state: {
      init: () => ({ maxContentSizeReached: false }),

      apply(tr, state) {
        const result = tr.doc && tr.doc.nodeSize > maxContentSize - 1;

        return {
          maxContentSizeReached: result,
        };
      },
    },
    key: pluginKey,
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

const maxContentSizePlugin: MaxContentSizePlugin = ({
  config: maxContentSize,
  api,
}) => {
  return {
    name: 'maxContentSize',
    getSharedState(editorState) {
      if (!editorState) {
        return undefined;
      }

      return pluginKey.getState(editorState);
    },

    pmPlugins() {
      return [
        {
          name: 'maxContentSize',
          plugin: ({ dispatch }) => createPlugin(dispatch, maxContentSize),
        },
      ];
    },
  };
};

export default maxContentSizePlugin;
