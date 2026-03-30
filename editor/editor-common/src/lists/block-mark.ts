import type { MarkType, Node as PMNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { createToggleBlockMarkOnRangeNext } from '../commands';

type BlockMarkAttrs = Record<string, unknown>;

const getDefaultBlockNodeTypes = (tr: Transaction): NodeType[] => {
	const { paragraph } = tr.doc.type.schema.nodes;
	return paragraph ? [paragraph] : [];
};

export const getBlockMarkAttrs = <T extends BlockMarkAttrs = BlockMarkAttrs>(
	node: PMNode | null | undefined,
	markType?: MarkType,
): T | false => {
	if (!node || !markType) {
		return false;
	}

	const blockMark = node.marks.find((mark) => mark.type === markType);
	return blockMark ? (blockMark.attrs as T) : false;
};

export const getFirstParagraphBlockMarkAttrs = <T extends BlockMarkAttrs = BlockMarkAttrs>(
	node: PMNode | null | undefined,
	markType?: MarkType,
): T | false => {
	if (!node || !markType) {
		return false;
	}

	const { paragraph } = node.type.schema.nodes;
	if (!paragraph) {
		return false;
	}

	const findFirstParagraphBlockMarkAttrs = (currentNode: PMNode): T | false => {
		if (currentNode.type === paragraph) {
			return getBlockMarkAttrs<T>(currentNode, markType);
		}

		for (let index = 0; index < currentNode.childCount; index++) {
			const childResult = findFirstParagraphBlockMarkAttrs(currentNode.child(index));
			if (childResult !== false) {
				return childResult;
			}
		}

		return false;
	};

	return findFirstParagraphBlockMarkAttrs(node);
};

export const reconcileBlockMarkInRange = <T extends BlockMarkAttrs = BlockMarkAttrs>(
	tr: Transaction,
	from: number,
	to: number,
	markType: MarkType | undefined,
	markAttrs: T | false,
	blockNodeTypes: NodeType[] = getDefaultBlockNodeTypes(tr),
): boolean => {
	if (!markType || blockNodeTypes.length === 0) {
		return false;
	}

	return createToggleBlockMarkOnRangeNext(markType, () => markAttrs, blockNodeTypes)(from, to, tr);
};

export const reconcileBlockMarkForContainerAtPos = <T extends BlockMarkAttrs = BlockMarkAttrs>(
	tr: Transaction,
	containerPos: number,
	markType: MarkType | undefined,
	markAttrs: T | false,
	blockNodeTypes: NodeType[] = getDefaultBlockNodeTypes(tr),
): boolean => {
	const containerNode = tr.doc.nodeAt(containerPos);
	if (!containerNode) {
		return false;
	}

	return reconcileBlockMarkInRange(
		tr,
		containerPos,
		containerPos + containerNode.nodeSize,
		markType,
		markAttrs,
		blockNodeTypes,
	);
};

export const reconcileBlockMarkForParagraphAtPos = <T extends BlockMarkAttrs = BlockMarkAttrs>(
	tr: Transaction,
	pos: number,
	markType: MarkType | undefined,
	markAttrs: T | false,
): boolean => {
	const { paragraph } = tr.doc.type.schema.nodes;
	if (!paragraph) {
		return false;
	}

	const resolvedPos = tr.doc.resolve(Math.max(0, Math.min(pos, tr.doc.content.size)));

	for (let depth = resolvedPos.depth; depth > 0; depth--) {
		const node = resolvedPos.node(depth);
		if (node.type === paragraph) {
			return reconcileBlockMarkInRange(
				tr,
				resolvedPos.before(depth),
				resolvedPos.before(depth) + node.nodeSize,
				markType,
				markAttrs,
				[paragraph],
			);
		}
	}

	return false;
};
