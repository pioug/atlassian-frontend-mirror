import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import type { FlattenedItem } from './flatten-list';

export interface BuildResult {
	/**
	 * For each element (by index), the offset within the fragment where the
	 * element's content begins.
	 *
	 * To get the absolute document position after `tr.replaceWith(rangeStart, …)`,
	 * add `rangeStart` to the offset.
	 */
	contentStartOffsets: number[];
	fragment: Fragment;
}

/** Rebuilds a list-like PM node from a flat array of items. */
type RebuildFn = (
	items: FlattenedItem[],
	schema: Schema,
) => { contentStartOffsets: number[]; node: PMNode } | null;

/** Extracts top-level content nodes from an item being broken out past the root list. */
type ExtractContentFn = (item: FlattenedItem, schema: Schema) => PMNode[];

interface BuildReplacementFragmentOptions {
	extractContentFn: ExtractContentFn;
	items: FlattenedItem[];
	rebuildFn: RebuildFn;
	schema: Schema;
}

/**
 * Build a replacement Fragment from a flat array of items.
 *
 * Items with depth >= 0 are grouped and rebuilt via `rebuildFn`.
 * Items with depth < 0 are extracted via `extractContentFn`.
 */
export function buildReplacementFragment({
	items,
	schema,
	rebuildFn,
	extractContentFn,
}: BuildReplacementFragmentOptions): BuildResult {
	let fragment = Fragment.empty;
	let pendingListSegment: FlattenedItem[] = [];
	let pendingStartIdx = 0;
	const contentStartOffsets: number[] = new Array(items.length);

	const flushListSegment = () => {
		if (pendingListSegment.length > 0) {
			const fragmentOffset = fragment.size;
			const result = rebuildFn(pendingListSegment, schema);
			if (result) {
				// Map the rebuild's content start offsets into the overall fragment.
				for (let i = 0; i < pendingListSegment.length; i++) {
					contentStartOffsets[pendingStartIdx + i] = fragmentOffset + result.contentStartOffsets[i];
				}
				fragment = fragment.addToEnd(result.node);
			}
			pendingListSegment = [];
		}
	};

	let elIdx = 0;
	for (const item of items) {
		if (item.depth < 0) {
			flushListSegment();
			// Extracted element — content children become top-level nodes.
			// Record offset of first content child.
			contentStartOffsets[elIdx] = fragment.size;
			for (const node of extractContentFn(item, schema)) {
				fragment = fragment.addToEnd(node);
			}
		} else {
			if (pendingListSegment.length === 0) {
				pendingStartIdx = elIdx;
			}
			pendingListSegment.push(item);
		}
		elIdx++;
	}
	flushListSegment();

	return { fragment, contentStartOffsets };
}
