import type { InputRuleHandler, InputRuleWrapper } from '@atlaskit/editor-common/types';
import { createRule, createWrappingJoinRule } from '@atlaskit/editor-common/utils';
import type { NodeType, Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';

import { WRAPPER_BLOCK_TYPES } from './block-types';

export const isNodeAWrappingBlockNode = (node?: PMNode | null) => {
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
	match: RegExp;
	nodeType: NodeType;
	getAttrs?: // eslint-disable-next-line @typescript-eslint/no-explicit-any
	| Record<string, any>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		| ((matchResult: RegExpExecArray) => Record<string, any>);
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
			codeBlock,
			decisionItem,
			decisionList,
			taskItem,
			taskList,
		} = state.schema.nodes;
		state.doc.nodesBetween($from.pos, $to.pos, (node) => {
			if (
				node.isBlock &&
				[
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
				].indexOf(node.type) >= 0
			) {
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
	const { panel } = state.schema.nodes;
	return nodesTypes.filter((type) => type !== panel).length > 0;
}
