import { EditorState } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { getDecorations } from '../pm-plugins/decorations/plugin';
import { TableDecorations } from '../types';

import { updateDecorations } from './decoration';

export const updatePluginStateDecorations = (
  state: EditorState<any>,
  decorations: Decoration[],
  key: TableDecorations,
): DecorationSet =>
  updateDecorations(state.doc, getDecorations(state), decorations, key);
