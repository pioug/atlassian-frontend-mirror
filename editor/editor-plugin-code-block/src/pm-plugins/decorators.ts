import type { Node } from '@atlaskit/editor-prosemirror/model';
import { Decoration } from '@atlaskit/editor-prosemirror/view';

import type { CodeBlockTextPosition } from '../types';
import { codeBlockClassNames } from '../ui/class-names';

export const generateTextPositionsFromNode = (pos: number, node: Node) => {
	// Get content node
	const contentNode = node.content;

	// Get node text content
	let textPositions: CodeBlockTextPosition[] = [];
	contentNode.forEach((child) => {
		const nodeTextContent = child.textContent;
		const nodeStartPos = pos;

		let lineStartIndex = nodeStartPos;
		const newLinePositions = nodeTextContent.split('\n').map((line) => {
			const lineLength = line.length;
			const lineStart = lineStartIndex + 1;
			const lineEnd = lineStart + lineLength;

			// Include the newline character and increment to keep tabs on line position
			lineStartIndex += lineLength + 1;

			return { lineStart, lineEnd };
		});

		textPositions = [...textPositions, ...newLinePositions];
	});

	return textPositions;
};

export const createDecorationSetFromTextPositions = (textPositions: CodeBlockTextPosition[]) => {
	const decorations = textPositions.map((textPosition) => {
		const { lineStart, lineEnd } = textPosition;
		return Decoration.inline(lineStart, lineEnd, {
			class: codeBlockClassNames.lineNumberWrapped,
		});
	});

	return decorations;
};

export const createLineNumbersDecorations = (pos: number, node: Node) =>
	createDecorationSetFromTextPositions(generateTextPositionsFromNode(pos, node));
