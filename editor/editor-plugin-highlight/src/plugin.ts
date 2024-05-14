import { backgroundColor } from '@atlaskit/adf-schema';
import type {
  NextEditorPlugin,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import type { AnalyticsPlugin } from '@atlaskit/editor-plugin-analytics';
import type { TextFormattingPlugin } from '@atlaskit/editor-plugin-text-formatting';

import type { HighlightPluginState } from './pm-plugin';
import { createPlugin, highlightPluginKey } from './pm-plugin';

export type HighlightPlugin = NextEditorPlugin<
  'highlight',
  {
    dependencies: [
      // Optional, we won't log analytics if it's not available
      OptionalPlugin<AnalyticsPlugin>,
      // Optional, used to allow clearing highlights when clear
      OptionalPlugin<TextFormattingPlugin>,
    ];
    sharedState: HighlightPluginState | undefined;
  }
>;

export const highlightPlugin: HighlightPlugin = ({ api }) => ({
  name: 'highlight',

  marks() {
    return [{ name: 'backgroundColor', mark: backgroundColor }];
  },

  pmPlugins: () => [
    {
      name: 'highlight',
      plugin: () => createPlugin({ api }),
    },
  ],

  getSharedState(editorState) {
    if (!editorState) {
      return;
    }
    return highlightPluginKey.getState(editorState);
  },

  // Add highlight toolbar button to primary toolbar
  // primaryToolbarComponent({ disabled }) {
  // TODO: Implement primary toolbar UI
  // },
});
