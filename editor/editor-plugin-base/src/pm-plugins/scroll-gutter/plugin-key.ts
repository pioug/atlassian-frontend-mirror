import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

export type ScrollGutterPluginState = {
  keyboardHeight: number;
};

export const scrollGutterPluginKey = new PluginKey<ScrollGutterPluginState>(
  'scrollGutter',
);

export const getScrollGutterPluginState = (state?: EditorState) => {
  if (state) {
    return scrollGutterPluginKey.getState(state) as
      | ScrollGutterPluginState
      | undefined;
  }
};
