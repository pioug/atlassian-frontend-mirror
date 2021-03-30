import { PluginKey } from 'prosemirror-state';
import { MediaEditorAction, MediaEditorState } from '../types';
import { pluginFactory } from '../../../utils/plugin-state-factory';

export const pluginKey = new PluginKey<MediaEditorState>('mediaEditorPlugin');

export const reducer = (
  state: MediaEditorState,
  action: MediaEditorAction,
): MediaEditorState => {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        editor: {
          identifier: action.identifier,
          pos: action.pos,
        },
      };
    case 'close':
      return {
        ...state,
        editor: undefined,
      };
    case 'upload':
      return {
        ...state,
        editor: undefined,
      };
    case 'setMediaClientConfig':
      return {
        ...state,
        mediaClientConfig: action.mediaClientConfig,
      };
    default:
      return state;
  }
};

export const {
  createPluginState,
  createCommand,
  getPluginState,
} = pluginFactory(pluginKey, reducer, {
  mapping: (tr, state) => {
    if (!state.editor) {
      return state;
    }

    // remap the position of the editing media inside the state
    return {
      ...state,
      editor: {
        ...state.editor,
        pos: tr.mapping.map(state.editor.pos),
      },
    };
  },
});
