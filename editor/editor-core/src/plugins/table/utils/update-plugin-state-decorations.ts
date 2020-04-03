import { EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { TableDecorations } from '../types';
import { getPluginState } from '../pm-plugins/plugin-factory';
import { updateNodeDecorations } from './decoration';

export const updatePluginStateDecorations = (
  state: EditorState<any>,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet =>
  updateNodeDecorations(
    state.doc,
    getPluginState(state).decorationSet || DecorationSet.empty,
    decorations,
    key,
  );
