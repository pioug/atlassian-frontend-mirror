import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { mobileDimensionsPluginKey } from './plugin-factory';

export const getMobileDimensionsPluginState = (state: EditorState) => {
  return mobileDimensionsPluginKey.getState(state);
};
