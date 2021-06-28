import { EditorState } from 'prosemirror-state';
import { mobileScrollPluginKey } from './plugin-factory';
import { MobileScrollPluginState } from './types';

export const getmobileScrollPluginState = (
  state: EditorState,
): MobileScrollPluginState | undefined => {
  const mobileScrollPlugin = state.plugins.find(
    (plugin) => (plugin as any).key === (mobileScrollPluginKey as any).key,
  );
  if (!mobileScrollPlugin) {
    return;
  }
  return mobileScrollPlugin.getState(state);
};
