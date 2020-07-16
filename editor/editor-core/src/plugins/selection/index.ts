import { EditorPlugin } from '../../types';

import { createPlugin } from './plugin';
import { SelectionPluginOptions } from './types';

export const selectionPlugin = (
  options?: SelectionPluginOptions,
): EditorPlugin => ({
  name: 'selection',

  pmPlugins() {
    return [
      {
        name: 'selection',
        plugin: ({ dispatch, dispatchAnalyticsEvent }) =>
          createPlugin(dispatch, dispatchAnalyticsEvent, options),
      },
    ];
  },
});

export default selectionPlugin;
