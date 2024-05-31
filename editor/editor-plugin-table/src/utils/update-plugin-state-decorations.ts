import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Decoration, DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { getDecorations } from '../pm-plugins/decorations/plugin';
import type { TableDecorations } from '../types';

import { updateDecorations } from './decoration';

export const updatePluginStateDecorations = (
	state: EditorState,
	decorations: Decoration[],
	key: TableDecorations,
): DecorationSet => updateDecorations(state.doc, getDecorations(state), decorations, key);
