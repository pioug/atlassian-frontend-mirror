import type { MarkType, NodeType, ResolvedPos } from '@atlaskit/editor-prosemirror/model';
import { Fragment, Node, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import { NodeSelection, Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import {
	canInsert,
	findParentNodeOfType,
	hasParentNodeOfType,
	isNodeSelection,
	safeInsert as pmSafeInsert,
} from '@atlaskit/editor-prosemirror/utils';

import { GapCursorSelection, Side } from '../selection';
import { isEmptyParagraph, isListItemNode } from '../utils';

export type InsertableContent = Node | Fragment;
export enum LookDirection {
	Before = 'before',
	After = 'after',
}

export const normaliseNestedLayout = (
	{ selection, doc }: EditorState | Transaction,
	node: Node,
) => {
	if (selection.$from.depth > 1) {
		if (node.attrs.layout && node.attrs.layout !== 'default') {
			return node.type.createChecked(
				{
					...node.attrs,
					layout: 'default',
				},
				node.content,
				node.marks,
			);
		}

		// If its a breakout layout, we can remove the mark
		// Since default isn't a valid breakout mode.
		const breakoutMark: MarkType = doc.type.schema.marks.breakout;
		if (breakoutMark && breakoutMark.isInSet(node.marks)) {
			const newMarks = breakoutMark.removeFromSet(node.marks);
			return node.type.createChecked(node.attrs, node.content, newMarks);
		}
	}

	return node;
};

const isLastChild = ($pos: ResolvedPos, doc: Node): boolean =>
	doc.resolve($pos.after()).node().lastChild === $pos.node();

const isFirstChild = ($pos: ResolvedPos, doc: Node): boolean =>
	doc.resolve($pos.before()).node().firstChild === $pos.node();

const nodeIsInsideAList = (tr: Transaction) => {
	const { nodes } = tr.doc.type.schema;
	return hasParentNodeOfType([nodes.orderedList, nodes.bulletList])(tr.selection);
};

const selectionIsInsideAPanel = (tr: Transaction) => {
	const { nodes } = tr.doc.type.schema;
	return hasParentNodeOfType(nodes.panel)(tr.selection);
};

const selectionIsInNestedList = (tr: Transaction) => {
	const { nodes } = tr.doc.type.schema;

	const parentListNode = findParentNodeOfType([nodes.orderedList, nodes.bulletList])(tr.selection);

	if (!parentListNode) {
		return false;
	}

	return isListItemNode(tr.doc.resolve(parentListNode.pos).parent);
};
const insertBeforeOrAfter = (
	tr: Transaction,
	lookDirection: LookDirection,
	$parentPos: ResolvedPos,
	$proposedPosition: ResolvedPos,
	content: InsertableContent,
) => {
	/**
	 * This block caters for the first item in a parent with the cursor being at the very start
	 * or the last item with the cursor being at the very end
	 *
	 * e.g.
	 * ul
	 *  li {<>}Scenario one
	 *  li
	 *  li Scenario two{<>}
	 */

	if (
		(isFirstChild($proposedPosition, tr.doc) && lookDirection === LookDirection.Before) ||
		(isLastChild($proposedPosition, tr.doc) && lookDirection === LookDirection.After)
	) {
		return tr.insert($parentPos[lookDirection](), content);
	}

	return tr.insert($proposedPosition[lookDirection](), content);
};

// Ignored via go/ees007
// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
// FIXME: A more sustainable and configurable way to choose when to split
// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shouldSplit = (nodeType: NodeType, schemaNodes: any) => {
	return [schemaNodes.bulletList, schemaNodes.orderedList, schemaNodes.panel].includes(nodeType);
};

export const safeInsert = (content: InsertableContent, position?: number) => (tr: Transaction) => {
	const { nodes } = tr.doc.type.schema;
	const whitelist = [nodes.rule, nodes.mediaSingle];

	if (content instanceof Fragment || !whitelist.includes(content.type)) {
		return null;
	}

	// Check for selection
	if (!tr.selection.empty || isNodeSelection(tr.selection)) {
		// NOT IMPLEMENTED
		return null;
	}

	const { $from } = tr.selection;
	const $insertPos = position
		? tr.doc.resolve(position)
		: isNodeSelection(tr.selection)
			? tr.doc.resolve($from.pos + 1)
			: $from;

	let lookDirection: LookDirection | undefined;
	const insertPosEnd = $insertPos.end();
	const insertPosStart = $insertPos.start();

	// When parent node is an empty paragraph,
	// check the empty paragraph is the first or last node of its parent.
	if (isEmptyParagraph($insertPos.parent)) {
		if (isLastChild($insertPos, tr.doc)) {
			lookDirection = LookDirection.After;
		} else if (isFirstChild($insertPos, tr.doc)) {
			lookDirection = LookDirection.Before;
		}
	} else {
		if ($insertPos.pos === insertPosEnd) {
			lookDirection = LookDirection.After;
		} else if ($insertPos.pos === insertPosStart) {
			lookDirection = LookDirection.Before;
		}
	}

	const grandParentNodeType = tr.selection.$from.node(-1)?.type;
	const parentNodeType = tr.selection.$from.parent.type;

	// if there is no direction, and cannot split for this particular node
	const noDirectionAndShouldNotSplit =
		!lookDirection &&
		!shouldSplitSelectedNodeOnNodeInsertion({
			parentNodeType,
			grandParentNodeType,
			content,
		});

	const ruleNodeInANestedListNode = content.type === nodes.rule && selectionIsInNestedList(tr);

	const nonRuleNodeInListNode = !(content.type === nodes.rule) && nodeIsInsideAList(tr);

	if (
		ruleNodeInANestedListNode ||
		(noDirectionAndShouldNotSplit && nonRuleNodeInListNode) ||
		(noDirectionAndShouldNotSplit && !nodeIsInsideAList(tr))
	) {
		// node to be inserted is an invalid child of selection so insert below selected node
		return pmSafeInsert(content, tr.selection.from)(tr);
	}

	// if node is a rule and that is a flat list splitting and not at the end of a list
	const { from, to } = tr.selection;
	const ruleTypeInAList = content.type === nodes.rule && nodeIsInsideAList(tr);
	if (ruleTypeInAList && !($insertPos.pos === insertPosEnd)) {
		return tr.replaceRange(from, to, new Slice(Fragment.from(nodes.rule.createChecked()), 0, 0));
	}

	if (!lookDirection) {
		// fallback to consumer for now
		return null;
	}

	// Replace empty paragraph
	if (
		isEmptyParagraph($insertPos.parent) &&
		canInsert(tr.doc.resolve($insertPos[lookDirection]()), content)
	) {
		return finaliseInsert(tr.replaceWith($insertPos.before(), $insertPos.after(), content), -1);
	}

	let $proposedPosition = $insertPos;
	while ($proposedPosition.depth > 0) {
		const $parentPos = tr.doc.resolve($proposedPosition[lookDirection]());
		const parentNode = $parentPos.node();

		// Insert at position (before or after target pos)
		if (canInsert($proposedPosition, content)) {
			return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
		}

		// If we can't insert, and we think we should split, we fallback to consumer for now
		if (shouldSplit(parentNode.type, tr.doc.type.schema.nodes)) {
			const nextTr = finaliseInsert(
				insertBeforeOrAfter(tr, lookDirection, $parentPos, $proposedPosition, content),
				content.nodeSize,
			);

			// Move selection to the closest text node, otherwise it defaults to the whatever the lookDirection is set to above
			if ([nodes.orderedList, nodes.bulletList].includes(parentNode.type) && nextTr) {
				return nextTr.setSelection(
					TextSelection.between(nextTr.selection.$from, nextTr.selection.$from),
				);
			} else {
				return nextTr;
			}
		}

		// Can not insert into current parent, step up one parent
		$proposedPosition = $parentPos;
	}

	return finaliseInsert(tr.insert($proposedPosition.pos, content), content.nodeSize);
};

type __ReplaceStep = (ReplaceStep | ReplaceAroundStep) & {
	slice: Slice;
	// Properties `to` and `slice` are private attributes of ReplaceStep.
	to: number;
};

const finaliseInsert = (tr: Transaction, nodeLength: number) => {
	const lastStep = tr.steps[tr.steps.length - 1];
	if (!(lastStep instanceof ReplaceStep || lastStep instanceof ReplaceAroundStep)) {
		return null;
	}

	// Place gap cursor after the newly inserted node
	const gapCursorPos =
		(lastStep as __ReplaceStep).to + (lastStep as __ReplaceStep).slice.openStart + nodeLength;
	return tr
		.setSelection(new GapCursorSelection(tr.doc.resolve(gapCursorPos), Side.RIGHT))
		.scrollIntoView();
};

/**
 * Method extracted from typeahead plugin to be shared with the element browser on handling element insertion.
 */
export const insertSelectedItem =
	(maybeNode?: Node | Object | string | Fragment, opts: { selectInlineNode?: boolean } = {}) =>
	(state: EditorState, tr: Transaction, start: number): Transaction => {
		if (!maybeNode) {
			return tr;
		}

		const isInputFragment = maybeNode instanceof Fragment;
		let node: Node | Fragment;
		try {
			node =
				maybeNode instanceof Node || isInputFragment
					? maybeNode
					: typeof maybeNode === 'string'
						? state.schema.text(maybeNode)
						: Node.fromJSON(state.schema, maybeNode);
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error(e);
			return tr;
		}

		if (node instanceof Node && node.isText) {
			tr = tr.replaceWith(start, start, node);

			/**
			 *
			 * Replacing a type ahead query mark with a block node.
			 *
			 */
		} else if (node instanceof Node && node.isBlock) {
			/**
			 *
			 * Rule has unique insertion behaviour
			 * so using this safeInsert function in order to handle specific cases in flat list vs nested list
			 * instead of a generic pmSafeInsert (i.e appending at the end)
			 *
			 */

			const selectionInsideAPanel = selectionIsInsideAPanel(tr);

			if (
				node.type.name === 'rule' &&
				!selectionInsideAPanel &&
				// ED-17438 If the selection is not an empty paragraph we want to use pmSafeInsert
				// This fixes a bug where if a rule was inserted using safeInsert and the selection
				// was an empty paragraph it would not be inserted
				!isEmptyParagraph(tr.selection.$from.parent)
			) {
				tr = safeInsert(node, tr.selection.from)(tr) ?? tr;
			} else {
				tr = pmSafeInsert(normaliseNestedLayout(state, node), undefined, true)(tr);
			}

			/**
			 *
			 * Replacing a type ahead query mark with an inline node.
			 *
			 */
		} else if ((node instanceof Node && node.isInline) || isInputFragment) {
			const fragment: Fragment = isInputFragment
				? (node as Fragment)
				: Fragment.fromArray([node as Node, state.schema.text(' ')]);

			tr = tr.replaceWith(start, start, fragment);

			if (opts.selectInlineNode) {
				// Select inserted node
				tr = tr.setSelection(NodeSelection.create(tr.doc, start));
			} else {
				// Placing cursor after node + space.
				tr = tr.setSelection(Selection.near(tr.doc.resolve(start + fragment.size)));
			}
		}

		return tr;
	};

/**
 * ED-14584: Util to check if the destination node is a paragraph & the
 * content being inserted is a valid child of the grandparent node.
 * In this case, the destination node should split
 */
export const shouldSplitSelectedNodeOnNodeInsertion = ({
	parentNodeType,
	grandParentNodeType,
	content,
}: {
	content: Node;
	grandParentNodeType: NodeType;
	parentNodeType: NodeType;
}): boolean => {
	if (
		parentNodeType.name === 'doc' ||
		(parentNodeType.name === 'paragraph' &&
			grandParentNodeType.validContent(Fragment.from(content as Node)))
	) {
		return true;
	}
	return false;
};

/**
 * Check if the current selection contains any nodes that are not permitted
 * as codeBlock child nodes. Note that this allows paragraphs and inline nodes
 * as we extract their text content.
 */
export function contentAllowedInCodeBlock(state: EditorState): boolean {
	const { $from, $to } = state.selection;
	let isAllowedChild = true;
	state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
		const withinSelection = $from.pos <= pos && pos + node.nodeSize <= $to.pos;

		if (!withinSelection) {
			return;
		}

		if (!isAllowedChild) {
			return false;
		}

		return (isAllowedChild =
			node.type === state.schema.nodes.listItem ||
			node.type === state.schema.nodes.bulletList ||
			node.type === state.schema.nodes.orderedList ||
			node.type === state.schema.nodes.paragraph ||
			node.isInline ||
			node.type === state.schema.nodes.panel ||
			node.isText);
	});

	return isAllowedChild;
}

/**
 * 	Check if a fragment contains a particular node by iterating through all the nodes in the fragment.
 *  If the node type is found will stop looking and return true.
 *  If the node type is not found, it will return false.
 */
export function fragmentContainsNodeType(fragment: Fragment, nodeType: NodeType): boolean {
	let doesContainNodeType = false;
	fragment.descendants((node) => {
		if (node.type === nodeType) {
			doesContainNodeType = true;
			// Stop looking
			return false;
		}
		return true;
	});
	return doesContainNodeType;
}
