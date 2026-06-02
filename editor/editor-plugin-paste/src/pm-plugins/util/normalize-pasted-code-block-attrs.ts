import {
	getDefaultCodeBlockAttrs,
	getInsertedCodeBlocksInTransaction,
} from '@atlaskit/editor-common/code-block';
import type { Node as PmNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

const isCodeBlockWithUnsetWrap = (node: PmNode): boolean => node.attrs.wrap === null;

const patchInsertedCodeBlocks = (
	tr: Transaction,
	insertedCodeBlocks: Array<{ node: PmNode; pos: number }>,
): void => {
	insertedCodeBlocks.forEach(({ node, pos }) => {
		tr.setNodeMarkup(pos, undefined, getDefaultCodeBlockAttrs(node.attrs), node.marks);
	});
};

export const normalizePastedCodeBlockAttrs = (
	tr: Transaction,
	codeBlockType: NodeType | undefined,
): Transaction => {
	if (!codeBlockType) {
		return tr;
	}

	const insertedCodeBlocks = getInsertedCodeBlocksInTransaction(tr, codeBlockType, {
		filter: isCodeBlockWithUnsetWrap,
	});

	if (insertedCodeBlocks.length) {
		patchInsertedCodeBlocks(tr, insertedCodeBlocks);
	}

	return tr;
};
