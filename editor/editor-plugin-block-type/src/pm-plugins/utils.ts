import { anyMarkActive } from '@atlaskit/editor-common/mark';
import type { InputRuleHandler, InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule, createWrappingJoinRule } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
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
export function areBlockTypesDisabled(state: EditorState): boolean {
	const nodesTypes: NodeType[] = getSelectedWrapperNodes(state);
	const { panel, blockquote, bulletList, orderedList } = state.schema.nodes;

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
			nodesTypes.filter((type) => type !== panel).length > 0 && (!hasQuote || hasNestedListInQuote)
		);
	}

	return nodesTypes.filter((type) => type !== panel).length > 0;
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
