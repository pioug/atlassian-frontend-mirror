/* eslint-disable @atlaskit/platform/ensure-feature-flag-prefix */

import { isCodeBlockWordWrapEnabled } from '@atlaskit/editor-common/code-block';
import { type EditorState, type ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { type NodeWithPos } from '@atlaskit/editor-prosemirror/utils';
import { Decoration, type DecorationSet } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { CodeBlockLineAttributes } from '../types';
import { codeBlockClassNames } from '../ui/class-names';

import { getAllCodeBlockNodesInDoc } from './utils';

export const DECORATION_WIDGET_TYPE = 'decorationWidgetType';
export const DECORATION_WRAPPED_BLOCK_NODE_TYPE = 'decorationNodeType';

/**
 * Generate the initial decorations for the code block.
 */
export const generateInitialDecorations = (state: EditorState) => {
	const codeBlockNodes = getAllCodeBlockNodesInDoc(state);

	return codeBlockNodes.flatMap((node) =>
		createDecorationSetFromLineAttributes(generateLineAttributesFromNode(node)),
	);
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
	// Update line number decorators for changed code block nodes if new line added or line removed.
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
 * Update the decorations set with the line number decorators. This will only happen for the code blocks passed to this function
 * when there has been a new line added or removed. The line decorations will not update the code block node otherwise.
 */
export const updateDecorationSetWithLineNumberDecorators = (
	tr: ReadonlyTransaction,
	codeBlockNodes: NodeWithPos[],
	decorationSet: DecorationSet,
): DecorationSet => {
	let updatedDecorationSet = decorationSet;

	if (!fg('editor_code_wrapping_perf_improvement_ed-25141')) {
		const children = updatedDecorationSet.find(
			undefined,
			undefined,
			(spec) => spec.type === DECORATION_WIDGET_TYPE,
		);
		updatedDecorationSet = updatedDecorationSet.remove(children);
	}

	const lineNumberDecorators: Decoration[] = [];

	codeBlockNodes.forEach((node) => {
		if (fg('editor_code_wrapping_perf_improvement_ed-25141')) {
			const existingWidgetsOnNode = updatedDecorationSet.find(
				node.pos,
				node.pos + node.node.nodeSize,
				(spec) => spec.type === DECORATION_WIDGET_TYPE,
			);

			const newLineAttributes = generateLineAttributesFromNode(node);

			// There will be no widgets on initialisation. If the number of existing widgets does not equal the amount of lines, regenerate the widgets.
			// There may be a case where the number of existing widgets and the number of lines are the same, that's why we track totalLineCount. This allows
			// us to know how many lines there were when the widget was created. It avoids a break in line numbers, e.g. "1, 2, 3, 5, 6". Happens on line removal.
			if (
				existingWidgetsOnNode.length === 0 ||
				existingWidgetsOnNode.length !== newLineAttributes.length ||
				existingWidgetsOnNode[0].spec.totalLineCount !== newLineAttributes.length
			) {
				updatedDecorationSet = updatedDecorationSet.remove(existingWidgetsOnNode);
				lineNumberDecorators.push(...createDecorationSetFromLineAttributes(newLineAttributes));
			}
		} else {
			lineNumberDecorators.push(
				...createDecorationSetFromLineAttributes(generateLineAttributesFromNode(node)),
			);
		}
	});

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
		// totalLineCount is used to know whether or not to update the line numbers when a new line is added or removed.
		return Decoration.widget(lineStart, createLineNumberWidget, {
			type: DECORATION_WIDGET_TYPE,
			side: -1,
			totalLineCount: fg('editor_code_wrapping_perf_improvement_ed-25141')
				? lineAttributes.length
				: undefined,
		});
	});

	return widgetDecorations;
};

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
				class: codeBlockClassNames.contentWrapped,
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
