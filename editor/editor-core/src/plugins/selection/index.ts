import { createPlugin } from './plugin';
import { EditorPlugin } from '../../types';
import { SelectionPluginOptions } from './types';

export const selectionPlugin = (
  options?: SelectionPluginOptions,
): EditorPlugin => ({
  name: 'selection',

  pmPlugins() {
    return [
      {
        name: 'selection',
        plugin: ({ dispatch }) => createPlugin(dispatch, options),
      },
    ];
  },
});

export default selectionPlugin;
