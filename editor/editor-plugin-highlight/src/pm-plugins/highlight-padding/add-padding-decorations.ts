import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';

import { isHighlightedTextNode, shouldPadLeft, shouldPadRight } from './utils';

type CreatePaddingDecorationOptions = {
	node: PMNode;
	padLeft: boolean;
	padRight: boolean;
	pos: number;
};

const createPaddingDecoration = ({
	pos,
	node,
	padLeft,
	padRight,
}: CreatePaddingDecorationOptions) => {
	const classes = [];
	const baseClass = 'background-color';
	const padLeftClass = `${baseClass}-padding-left`;
	const padRightClass = `${baseClass}-padding-right`;

	if (padLeft) {
		classes.push(padLeftClass);
	}
	if (padRight) {
		classes.push(padRightClass);
	}

	return Decoration.inline(pos, pos + node.nodeSize, {
		class: classes.join(' '),
	});
};

type AddPaddingDecorationsOptions = {
	decorationSet: DecorationSet;
	from: number;
	state: EditorState;
	to: number;
};

/**
 * Adds padding decorations to highlighted text
 * within the specified range.
 */
export const addPaddingDecorations = ({
	decorationSet,
	state,
	from,
	to,
}: AddPaddingDecorationsOptions): DecorationSet => {
	let newDecorationSet = decorationSet;

	state.doc.nodesBetween(from, to, (node, pos) => {
		if (!isHighlightedTextNode(node)) {
			return;
		}

		const nodeStart = pos;
		const nodeEnd = pos + node.nodeSize;
		const padLeft = shouldPadLeft({ state, nodeStart });
		const padRight = shouldPadRight({ state, nodeEnd });

		if (padLeft && padRight) {
			const newDecoration = createPaddingDecoration({
				pos: nodeStart,
				node,
				padLeft,
				padRight,
			});
			newDecorationSet = newDecorationSet.add(state.doc, [newDecoration]);
		}
	});

	return newDecorationSet;
};
