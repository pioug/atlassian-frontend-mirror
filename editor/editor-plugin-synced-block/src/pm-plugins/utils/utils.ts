import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { NodeType, Node as PMNode, Schema, Slice } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { findParentNodeOfType, findSelectedNodeOfType } from '@atlaskit/editor-prosemirror/utils';
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
export const canBeConvertedToSyncBlock = (selection: Selection): SyncBlockConversionInfo | false => {
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
