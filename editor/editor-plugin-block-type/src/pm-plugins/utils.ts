import { anyMarkActive } from '@atlaskit/editor-common/mark';
import type { InputRuleHandler, InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule, createWrappingJoinRule } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { WRAPPER_BLOCK_TYPES, FORMATTING_NODE_TYPES, FORMATTING_MARK_TYPES } from './block-types';
import type { BlockType } from './types';

export const isNodeAWrappingBlockNode = (node?: PMNode | null): boolean => {
	if (!node) {
		return false;
	}
	return WRAPPER_BLOCK_TYPES.some((blockNode) => blockNode.name === node.type.name);
};

export const createJoinNodesRule = (match: RegExp, nodeType: NodeType): InputRuleWrapper => {
	return createWrappingJoinRule({
		nodeType,
		match,
		getAttrs: {},
		joinPredicate: (_, node) => node.type === nodeType,
	});
};

type WrappingTextRuleProps = {
	getAttrs?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
		| Record<string, any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		| ((matchResult: RegExpExecArray) => Record<string, any>);
	match: RegExp;
	nodeType: NodeType;
};
export const createWrappingTextBlockRule = ({
	match,
	nodeType,
	getAttrs,
}: WrappingTextRuleProps): InputRuleWrapper => {
	const handler: InputRuleHandler = (
		state: EditorState,
		match: RegExpExecArray,
		start: number,
		end: number,
	) => {
		const fixedStart = Math.max(start, 1);
		const $start = state.doc.resolve(fixedStart);
		const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;

		const nodeBefore = $start.node(-1);
		if (
			nodeBefore &&
			!nodeBefore.canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)
		) {
			return null;
		}

		return state.tr.delete(fixedStart, end).setBlockType(fixedStart, fixedStart, nodeType, attrs);
	};

	return createRule(match, handler);
};

/**
 * Function will create a list of wrapper blocks present in a selection.
 */
function getSelectedWrapperNodes(state: EditorState): NodeType[] {
	const nodes: Array<NodeType> = [];
	if (state.selection) {
		const { $from, $to } = state.selection;
		const {
			blockquote,
			panel,
			orderedList,
			bulletList,
			listItem,
			caption,
			codeBlock,
			decisionItem,
			decisionList,
			taskItem,
			taskList,
		} = state.schema.nodes;

		const wrapperNodes = [
			blockquote,
			panel,
			orderedList,
			bulletList,
			listItem,
			codeBlock,
			decisionItem,
			decisionList,
			taskItem,
			taskList,
		];

		wrapperNodes.push(caption);
		state.doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (node.isBlock && wrapperNodes.indexOf(node.type) >= 0) {
				nodes.push(node.type);
			}
		});
	}
	return nodes;
}

/**
 * Function will check if changing block types: Paragraph, Heading is enabled.
 */
export function areBlockTypesDisabled(state: EditorState, allowFontSize = false): boolean {
	const nodesTypes: NodeType[] = getSelectedWrapperNodes(state);
	const { panel, blockquote, bulletList, orderedList, listItem } = state.schema.nodes;

	// When the small font size experiment is enabled, allow block type changes inside lists
	// so that users can toggle between Normal text and Small text within list contexts.
	// Note: taskList/taskItem are not excluded here until blockTaskItem conversion is implemented (WI 4).
	const excludedTypes: NodeType[] =
		allowFontSize && expValEquals('platform_editor_small_font_size', 'isEnabled', true)
			? [panel, bulletList, orderedList, listItem]
			: [panel];

	if (editorExperiment('platform_editor_blockquote_in_text_formatting_menu', true)) {
		let hasQuote = false;
		let hasNestedListInQuote = false;

		const { $from, $to } = state.selection;

		state.doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (node.type === blockquote) {
				hasQuote = true;
				node.descendants((child) => {
					if (child.type === bulletList || child.type === orderedList) {
						hasNestedListInQuote = true;
						return false;
					}
					return true;
				});
			}
			return !hasNestedListInQuote;
		});

		return (
			nodesTypes.filter((type) => !excludedTypes.includes(type)).length > 0 &&
			(!hasQuote || hasNestedListInQuote)
		);
	}

	return nodesTypes.filter((type) => !excludedTypes.includes(type)).length > 0;
}

/**
 * Checks if the current selection is inside a list node (bulletList, orderedList, or taskList).
 * Used to determine which text styles should be enabled when the small font size experiment is active.
 */
export function isSelectionInsideListNode(state: EditorState): boolean {
	if (!state.selection) {
		return false;
	}

	const { $from, $to } = state.selection;
	const { bulletList, orderedList, taskList } = state.schema.nodes;
	const listNodeTypes = [bulletList, orderedList, taskList];

	let insideList = false;
	state.doc.nodesBetween($from.pos, $to.pos, (node) => {
		if (node.isBlock && listNodeTypes.indexOf(node.type) >= 0) {
			insideList = true;
			return false;
		}
		return true;
	});

	return insideList;
}

const blockStylingIsPresent = (state: EditorState): boolean => {
	const { from, to } = state.selection;
	let isBlockStyling = false;
	state.doc.nodesBetween(from, to, (node) => {
		if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
			isBlockStyling = true;
			return false;
		}
		return true;
	});
	return isBlockStyling;
};

const marksArePresent = (state: EditorState) => {
	const activeMarkTypes = FORMATTING_MARK_TYPES.filter((mark) => {
		if (!!state.schema.marks[mark]) {
			const { $from, empty } = state.selection;
			const { marks } = state.schema;
			if (empty) {
				return !!marks[mark].isInSet(state.storedMarks || $from.marks());
			}
			return anyMarkActive(state, marks[mark]);
		}
		return false;
	});
	return activeMarkTypes.length > 0;
};

export const checkFormattingIsPresent = (state: EditorState): boolean => {
	return marksArePresent(state) || blockStylingIsPresent(state);
};

export const hasBlockQuoteInOptions = (dropdownOptions: BlockType[]): boolean => {
	return !!dropdownOptions.find((blockType) => blockType.name === 'blockquote');
};

/**
 * Returns a { from, to } range that extends the selection boundaries outward
 * to include the entirety of any list nodes at either end. If the selection
 * start is inside a list, `from` is pulled back to the list's start; if the
 * selection end is inside a list, `to` is pushed forward to the list's end.
 * Non-list content in the middle is included as-is.
 */
export function getSelectionRangeExpandedToLists(tr: Transaction): {
	from: number;
	to: number;
} {
	const { selection } = tr;
	const { bulletList, orderedList, taskList } = tr.doc.type.schema.nodes;
	const listNodeTypes = [bulletList, orderedList, taskList];

	let from = selection.from;
	let to = selection.to;

	for (let depth = selection.$from.depth; depth > 0; depth--) {
		const node = selection.$from.node(depth);
		if (listNodeTypes.indexOf(node.type) >= 0) {
			from = selection.$from.before(depth);
			break;
		}
	}

	for (let depth = selection.$to.depth; depth > 0; depth--) {
		const node = selection.$to.node(depth);
		if (listNodeTypes.indexOf(node.type) >= 0) {
			to = selection.$to.after(depth);
			break;
		}
	}

	return { from, to };
}
