import { getDefaultCodeBlockAttrs } from '@atlaskit/editor-common/code-block';
import type { Node as PmNode, NodeType } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';

const isReplaceStep = (step: unknown): step is ReplaceStep | ReplaceAroundStep =>
	step instanceof ReplaceStep || step instanceof ReplaceAroundStep;

const isCodeBlockWithUnsetWrap = (node: PmNode, codeBlockType: NodeType): boolean =>
	node.type === codeBlockType && node.attrs.wrap === null;

const collectInsertedCodeBlocksWithUnsetWrap = (
	step: ReplaceStep | ReplaceAroundStep,
	codeBlockType: NodeType,
): Set<PmNode> => {
	const insertedCodeBlocks = new Set<PmNode>();

	step.slice.content.descendants((node) => {
		if (isCodeBlockWithUnsetWrap(node, codeBlockType)) {
			insertedCodeBlocks.add(node);
			return false;
		}

		return true;
	});

	return insertedCodeBlocks;
};

const collectMappedInsertedRanges = (
	tr: Transaction,
	stepIndex: number,
): Array<[number, number]> => {
	const ranges: Array<[number, number]> = [];
	const stepMap = tr.mapping.maps[stepIndex];
	const remainingMaps = tr.mapping.slice(stepIndex + 1);

	stepMap.forEach((_oldStart, _oldEnd, newStart, newEnd) => {
		if (newStart === newEnd) {
			return;
		}

		const finalFrom = remainingMaps.map(newStart, 1);
		const finalTo = remainingMaps.map(newEnd, -1);

		if (finalFrom < finalTo) {
			ranges.push([finalFrom, finalTo]);
		}
	});

	return ranges;
};

const collectInsertedCodeBlockPositions = (
	tr: Transaction,
	ranges: Array<[number, number]>,
	insertedCodeBlocks: Set<PmNode>,
): Set<number> => {
	const positions = new Set<number>();

	ranges.forEach(([from, to]) => {
		tr.doc.nodesBetween(from, to, (node, pos) => {
			if (insertedCodeBlocks.has(node)) {
				positions.add(pos);
				return false;
			}

			return true;
		});
	});

	return positions;
};

const patchInsertedCodeBlocks = (
	tr: Transaction,
	positionsToPatch: Set<number>,
	insertedCodeBlocks: Set<PmNode>,
): void => {
	positionsToPatch.forEach((pos) => {
		const node = tr.doc.nodeAt(pos);

		if (!node || !insertedCodeBlocks.has(node)) {
			return;
		}

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

	const insertedCodeBlocks = new Set<PmNode>();
	const positionsToPatch = new Set<number>();

	tr.steps.forEach((step, index) => {
		if (!isReplaceStep(step)) {
			return;
		}

		const codeBlocksInsertedByStep = collectInsertedCodeBlocksWithUnsetWrap(step, codeBlockType);

		if (!codeBlocksInsertedByStep.size) {
			return;
		}

		codeBlocksInsertedByStep.forEach((node) => insertedCodeBlocks.add(node));

		collectInsertedCodeBlockPositions(
			tr,
			collectMappedInsertedRanges(tr, index),
			codeBlocksInsertedByStep,
		).forEach((pos) => positionsToPatch.add(pos));
	});

	if (positionsToPatch.size) {
		patchInsertedCodeBlocks(tr, positionsToPatch, insertedCodeBlocks);
	}

	return tr;
};
