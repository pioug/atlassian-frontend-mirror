/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */
import { isCodeBlockWordWrapEnabled } from '@atlaskit/editor-common/code-block';
import { type EditorState, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { type NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CodeBlockLineAttributes } from '../types';
import { codeBlockClassNames } from '../ui/class-names';
import { getAllCodeBlockNodesInDoc } from '../utils';

export const DECORATION_WIDGET_TYPE = 'decorationWidgetType';
export const DECORATION_WRAPPED_BLOCK_NODE_TYPE = 'decorationNodeType';

/**
 * Generate the initial decorations for the code block.
 */
export const generateInitialDecorations = (state: EditorState) => {
	const codeBlockNodes = getAllCodeBlockNodesInDoc(state);

	return codeBlockNodes.flatMap((node) => createLineNumbersDecorations(node));
};

/**
 * Update all the decorations used by the code block.
 */
export const updateCodeBlockDecorations = (
	tr: ReadonlyTransaction,
	codeBlockNodes: NodeWithPos[],
	decorationSet: DecorationSet,
): DecorationSet => {
	let updatedDecorationSet = decorationSet;

	// All the line numbers decorators are refreshed on doc change.
	updatedDecorationSet = updateDecorationSetWithLineNumberDecorators(
		tr,
		codeBlockNodes,
		updatedDecorationSet,
	);

	// Check to make sure the word wrap decorators are still valid.
	updatedDecorationSet = validateWordWrappedDecorators(tr, codeBlockNodes, updatedDecorationSet);

	return updatedDecorationSet;
};

/**
 * Update the decorations set with the line number decorators.
 */
export const updateDecorationSetWithLineNumberDecorators = (
	tr: ReadonlyTransaction,
	codeBlockNodes: NodeWithPos[],
	decorationSet: DecorationSet,
): DecorationSet => {
	let updatedDecorationSet = decorationSet;
	// remove all the line number children from the decorations set. 'undefined, undefined' is used to find() the whole doc.
	const children = updatedDecorationSet.find(
		undefined,
		undefined,
		(spec) => spec.type === DECORATION_WIDGET_TYPE,
	);
	updatedDecorationSet = updatedDecorationSet.remove(children);

	// regenerate all the line number for the documents code blocks
	const lineNumberDecorators: Decoration[] = [];

	codeBlockNodes.forEach((node) => {
		lineNumberDecorators.push(...createLineNumbersDecorations(node));
	});

	// add the newly generated line numbers to the decorations set
	return updatedDecorationSet.add(tr.doc, [...lineNumberDecorators]);
};

export const generateLineAttributesFromNode = (node: NodeWithPos) => {
	const { node: innerNode, pos } = node;
	// Get content node
	const contentNode = innerNode.content;

	// Get node text content
	let lineAttributes: CodeBlockLineAttributes[] = [];

	// Early exit if content size is 0
	if (contentNode.size === 0) {
		return [{ lineStart: pos + 1, lineNumber: 1 }];
	}

	contentNode.forEach((child) => {
		const nodeTextContent = child.textContent;
		const nodeStartPos = pos;

		let lineStartIndex = nodeStartPos;
		const newLineAttributes = nodeTextContent.split('\n').map((line, index) => {
			const lineLength = line.length;
			const lineStart = lineStartIndex + 1;
			const lineNumber = index + 1;

			// Include the newline character and increment to keep tabs on line position
			lineStartIndex += lineLength + 1;

			return { lineStart, lineNumber };
		});

		lineAttributes = [...lineAttributes, ...newLineAttributes];
	});

	return lineAttributes;
};

export const createDecorationSetFromLineAttributes = (
	lineAttributes: CodeBlockLineAttributes[],
) => {
	const widgetDecorations = lineAttributes.map((lineAttribute) => {
		const { lineStart, lineNumber } = lineAttribute;

		// Passing a function to create the widget rather than directly passing a widget, as per ProseMirror docs.
		const createLineNumberWidget = () => {
			const widget = document.createElement('span');
			widget.textContent = `${lineNumber}`;
			widget.classList.add(codeBlockClassNames.lineNumberWidget);
			return widget;
		};

		// side -1 is used so the line numbers are the first thing to the left of the lines of code.
		return Decoration.widget(lineStart, createLineNumberWidget, {
			type: DECORATION_WIDGET_TYPE,
			side: -1,
		});
	});

	return widgetDecorations;
};

export const createLineNumbersDecorations = (node: NodeWithPos) =>
	createDecorationSetFromLineAttributes(generateLineAttributesFromNode(node));

/**
 * There are edge cases like when a user drags and drops a code block node where the decorator breaks and no longer reflects
 * the correct word wrap state. This function validates that the decorator and the state are in line, otherwise it will
 * retrigger the logic to apply the word wrap decorator.
 */
export const validateWordWrappedDecorators = (
	tr: ReadonlyTransaction,
	codeBlockNodes: NodeWithPos[],
	decorationSet: DecorationSet,
) => {
	let updatedDecorationSet = decorationSet;
	codeBlockNodes.forEach((node) => {
		const isCodeBlockWrappedInState = isCodeBlockWordWrapEnabled(node.node);
		const isCodeBlockWrappedByDecorator =
			getWordWrapDecoratorsFromNodePos(node.pos, decorationSet).length !== 0;

		if (fg('editor_code_block_wrapping_language_change_bug')) {
			if (isCodeBlockWrappedInState !== isCodeBlockWrappedByDecorator) {
				updatedDecorationSet = updateDecorationSetWithWordWrappedDecorator(decorationSet, tr, node);
			}
		} else {
			if (isCodeBlockWrappedInState && !isCodeBlockWrappedByDecorator) {
				updatedDecorationSet = updateDecorationSetWithWordWrappedDecorator(decorationSet, tr, node);
			}
		}
	});

	return updatedDecorationSet;
};

/**
 * Update the decoration set with the word wrap decorator.
 */
export const updateDecorationSetWithWordWrappedDecorator = (
	decorationSet: DecorationSet,
	tr: ReadonlyTransaction,
	node: NodeWithPos | undefined,
): DecorationSet => {
	if (!node || node.pos === undefined) {
		return decorationSet;
	}

	let updatedDecorationSet = decorationSet;

	const { pos, node: innerNode } = node;

	const isNodeWrapped = isCodeBlockWordWrapEnabled(innerNode);

	if (!isNodeWrapped) {
		const currentWrappedBlockDecorationSet = getWordWrapDecoratorsFromNodePos(
			pos,
			updatedDecorationSet,
		);

		updatedDecorationSet = updatedDecorationSet.remove(currentWrappedBlockDecorationSet);
	} else {
		const wrappedBlock = Decoration.node(
			pos,
			pos + innerNode.nodeSize,
			{
				class: codeBlockClassNames.contentFgWrapped,
			},
			{ type: DECORATION_WRAPPED_BLOCK_NODE_TYPE }, // Allows for quick filtering of decorations while using `find`
		);
		updatedDecorationSet = updatedDecorationSet.add(tr.doc, [wrappedBlock]);
	}
	return updatedDecorationSet;
};

/**
 * Get the word wrap decorators for the given node position.
 */
export const getWordWrapDecoratorsFromNodePos = (pos: number, decorationSet: DecorationSet) => {
	const codeBlockNodePosition = pos + 1; // We need to add 1 to the position to get the start of the node.
	const currentWrappedBlockDecorationSet = decorationSet.find(
		codeBlockNodePosition,
		codeBlockNodePosition,
		(spec) => spec.type === DECORATION_WRAPPED_BLOCK_NODE_TYPE,
	);
	return currentWrappedBlockDecorationSet;
};
