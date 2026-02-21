import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Selection, Transaction } from '@atlaskit/editor-prosemirror/state';
import { ReplaceAroundStep, ReplaceStep } from '@atlaskit/editor-prosemirror/transform';
import {
	findParentNodeOfType,
	findParentNodeOfTypeClosestToPos,
	findSelectedNodeOfType,
} from '@atlaskit/editor-prosemirror/utils';
import type { ContentNodeWithPos } from '@atlaskit/editor-prosemirror/utils';

export const findSyncBlock = (
	schema: Schema,
	selection: Selection,
): ContentNodeWithPos | undefined => {
	const { syncBlock } = schema.nodes;
	return findSelectedNodeOfType(syncBlock)(selection);
};

export const findBodiedSyncBlock = (
	schema: Schema,
	selection: Selection,
): ContentNodeWithPos | undefined => {
	return (
		findSelectedNodeOfType(schema.nodes.bodiedSyncBlock)(selection) ||
		findParentNodeOfType(schema.nodes.bodiedSyncBlock)(selection)
	);
};

export const findSyncBlockOrBodiedSyncBlock = (
	schema: Schema,
	selection: Selection,
): ContentNodeWithPos | undefined => {
	return findSyncBlock(schema, selection) || findBodiedSyncBlock(schema, selection);
};

export const isBodiedSyncBlockNode = (node: PMNode, bodiedSyncBlock: NodeType): boolean =>
	node.type === bodiedSyncBlock;

export interface SyncBlockConversionInfo {
	contentToInclude: Fragment;
	from: number;
	to: number;
}

const UNSUPPORTED_NODE_TYPES = new Set([
	'inlineExtension',
	'extension',
	'bodiedExtension',
	'syncBlock',
	'bodiedSyncBlock',
]);

/**
 * Checks whether the selection can be converted to sync block
 *
 * @param selection - the current editor selection to validate for sync block conversion
 * @returns A fragment containing the content to include in the synced block,
 * stripping out unsupported marks (breakout on codeblock/expand/layout), as well as from and to positions,
 * or false if conversion is not possible
 */
export const canBeConvertedToSyncBlock = (
	selection: Selection,
): SyncBlockConversionInfo | false => {
	const { $from, range } = expandSelectionToBlockRange(selection);

	if (!range) {
		return false;
	}

	const from = range.start;
	const to = range.end;

	let canBeConverted = true;
	$from.doc.nodesBetween(from, to, (node) => {
		if (UNSUPPORTED_NODE_TYPES.has(node.type.name)) {
			canBeConverted = false;
			return false;
		}
	});

	if (!canBeConverted) {
		return false;
	}

	const contentToInclude = removeBreakoutMarks($from.doc.slice(from, to).content);

	return {
		contentToInclude,
		from,
		to,
	};
};

const removeBreakoutMarks = (content: Fragment): Fragment => {
	const nodes: PMNode[] = [];

	// we only need to recurse at the top level, because breakout has to be on a top level
	content.forEach((node) => {
		const filteredMarks = node.marks.filter((mark) => mark.type.name !== 'breakout');

		if (node.isText) {
			nodes.push(node);
		} else {
			const newNode = node.type.create(node.attrs, node.content, filteredMarks);
			nodes.push(newNode);
		}
	});

	return Fragment.from(nodes);
};

export const sliceFullyContainsNode = (slice: Slice, node: PMNode): boolean => {
	const isFirstChild =
		slice.content.firstChild?.type === node.type &&
		slice.content.firstChild?.attrs.resourceId === node.attrs.resourceId;

	const isLastChild =
		slice.content.lastChild?.type === node.type &&
		slice.content.lastChild?.attrs.resourceId === node.attrs.resourceId;

	const isOpenAtStart = isFirstChild && slice.openStart > 0;
	const isOpenAtEnd = isLastChild && slice.openEnd > 0;

	if (isOpenAtStart || isOpenAtEnd) {
		return false;
	}

	return true;
};

const fragmentContainsInlineExtension = (fragment: Fragment): boolean => {
	let found = false;
	fragment.forEach((node) => {
		if (found) {
			return;
		}
		if (node.type.name === 'inlineExtension') {
			found = true;
		} else if (node.content.size) {
			if (fragmentContainsInlineExtension(node.content)) {
				found = true;
			}
		}
	});
	return found;
};

const sliceContainsInlineExtension = (slice: Slice): boolean =>
	fragmentContainsInlineExtension(slice.content);

/**
 * Returns the resourceId of the bodied sync block where an inline extension was inserted, or undefined.
 * Used to show a warning flag only on the first instance per sync block.
 */
export const wasInlineExtensionInsertedInBodiedSyncBlock = (
	tr: Transaction,
	state: EditorState,
): string | undefined => {
	if (!tr.docChanged || tr.getMeta('isRemote')) {
		return undefined;
	}

	const { bodiedSyncBlock } = state.schema.nodes;
	if (!bodiedSyncBlock) {
		return undefined;
	}

	const docs = (tr as Transaction & { docs?: (typeof tr.doc)[] }).docs;

	// When docs is available (e.g. from history plugin), check each replace step
	if (docs && docs.length > 0) {
		for (let i = 0; i < tr.steps.length; i++) {
			const step = tr.steps[i];
			const isReplaceStep = step instanceof ReplaceStep || step instanceof ReplaceAroundStep;
			if (!isReplaceStep || !('slice' in step) || !('from' in step)) {
				continue;
			}
			const replaceStep = step as ReplaceStep | ReplaceAroundStep;
			if (!sliceContainsInlineExtension(replaceStep.slice)) {
				continue;
			}
			const docAfterStep = docs[i + 1] ?? tr.doc;
			try {
				const $pos = docAfterStep.resolve(replaceStep.from);
				const parent = findParentNodeOfTypeClosestToPos($pos, bodiedSyncBlock);
				if (parent?.node.attrs.resourceId) {
					return parent.node.attrs.resourceId as string;
				}
			} catch {
				// resolve() can throw if position is invalid
			}
		}
		return undefined;
	}

	// Fallback: scan final doc for inline extensions inside bodied sync block that were added
	let resourceId: string | undefined;
	tr.doc.descendants((node, pos) => {
		if (resourceId !== undefined) {
			return false;
		}
		if (node.type.name === 'inlineExtension') {
			const $pos = tr.doc.resolve(pos);
			const parent = findParentNodeOfTypeClosestToPos($pos, bodiedSyncBlock);
			if (parent?.node.attrs.resourceId) {
				const mappedPos = tr.mapping.invert().map(pos);
				const nodeBefore = state.doc.nodeAt(mappedPos);
				if (!nodeBefore || nodeBefore.type.name !== 'inlineExtension') {
					resourceId = parent.node.attrs.resourceId as string;
					return false;
				}
			}
		}
		return true;
	});
	return resourceId;
};
