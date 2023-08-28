import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import type { DecorationState, HoverDecorationHandler } from './pm-plugin';
import decorationPlugin, {
  decorationStateKey,
  hoverDecoration,
  removeDecoration,
} from './pm-plugin';

export type DecorationsPlugin = NextEditorPlugin<
  'decorations',
  {
    sharedState: DecorationState;
    actions: {
      hoverDecoration: HoverDecorationHandler;
      removeDecoration: typeof removeDecoration;
    };
  }
>;

export const decorationsPlugin: DecorationsPlugin = () => ({
  name: 'decorations',

  pmPlugins() {
    return [{ name: 'decorationPlugin', plugin: () => decorationPlugin() }];
  },

  actions: {
    hoverDecoration,
    removeDecoration,
  },

  getSharedState(editorState) {
    if (!editorState) {
      return { decoration: undefined };
    }
    return decorationStateKey.getState(editorState);
  },
});
