import type { NextEditorPlugin } from '@atlaskit/editor-common/types';

import decorationPlugin, {
  DecorationState,
  decorationStateKey,
  hoverDecoration,
  HoverDecorationHandler,
  removeDecoration,
} from './pm-plugin';

export const decorationsPlugin: NextEditorPlugin<
  'decorations',
  {
    sharedState: DecorationState;
    actions: {
      hoverDecoration: HoverDecorationHandler;
      removeDecoration: typeof removeDecoration;
    };
  }
> = () => ({
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
