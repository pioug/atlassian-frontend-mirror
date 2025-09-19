import { type EditorState } from '@atlaskit/editor-prosemirror/state';
import { type DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { addPaddingDecorations } from './add-padding-decorations';

type UpdatePaddingDecorationsOptions = {
	decorationSet: DecorationSet;
	end: number;
	start: number;
	state: EditorState;
};

/**
 * Updates padding decorations in the specified range.
 */
export const updatePaddingDecorations = ({
	decorationSet: prevDecorationSet,
	state,
	start,
	end,
}: UpdatePaddingDecorationsOptions) => {
	// First remove any decorations within the range
	// Note that it finds all decorations in the set which touch the given range (including decorations that start or end directly at the boundaries)
	const toRemove = prevDecorationSet.find(start, end);
	const decorationSet = prevDecorationSet.remove(toRemove);

	// Expand the range by 1 on each side to catch adjacent text nodes
	// that may need padding decorations added/removed
	const from = Math.max(0, start - 1);
	const to = Math.min(state.doc.content.size, end + 1);
	return addPaddingDecorations({ decorationSet, state, from, to });
};
