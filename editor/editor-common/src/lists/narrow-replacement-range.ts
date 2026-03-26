import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

export type NarrowedReplacement = {
	adjustedContentStartOffsets: number[];
	end: number;
	fragment: Fragment;
	start: number;
};

/**
 * Narrows a full-list replacement to the minimal changed range.
 *
 * Compares the old root list node with the new replacement fragment
 * from both ends to find the first and last positions where they differ,
 * then returns only the changed subrange.
 *
 * This reduces the scope of `tr.replaceWith()` so that remote cursors
 * on unchanged items are preserved during collaborative editing.
 */
export function narrowReplacementRange(
	doc: PMNode,
	rootListStart: number,
	rootListEnd: number,
	fragment: Fragment,
	contentStartOffsets: number[],
): NarrowedReplacement {
	const oldNode = doc.nodeAt(rootListStart);
	const newNode = fragment.childCount === 1 ? fragment.firstChild : null;

	if (!oldNode || !newNode || newNode.type !== oldNode.type) {
		return {
			start: rootListStart,
			end: rootListEnd,
			fragment,
			adjustedContentStartOffsets: contentStartOffsets,
		};
	}

	const minChildCount = Math.min(oldNode.childCount, newNode.childCount);
	let commonPrefixChildren = 0;
	let prefixSize = 0;

	for (let i = 0; i < minChildCount; i++) {
		const oldChild = oldNode.child(i);
		const newChild = newNode.child(i);
		if (oldChild.eq(newChild)) {
			commonPrefixChildren++;
			prefixSize += oldChild.nodeSize;
		} else {
			break;
		}
	}

	let commonSuffixChildren = 0;
	let suffixSize = 0;

	for (let i = 0; i < minChildCount - commonPrefixChildren; i++) {
		const oldChild = oldNode.child(oldNode.childCount - 1 - i);
		const newChild = newNode.child(newNode.childCount - 1 - i);
		if (oldChild.eq(newChild)) {
			commonSuffixChildren++;
			suffixSize += oldChild.nodeSize;
		} else {
			break;
		}
	}

	const totalCommon = commonPrefixChildren + commonSuffixChildren;
	if (totalCommon >= oldNode.childCount && totalCommon >= newNode.childCount) {
		return {
			start: rootListStart,
			end: rootListStart,
			fragment: Fragment.empty,
			adjustedContentStartOffsets: contentStartOffsets,
		};
	}

	const narrowedStart = rootListStart + 1 + prefixSize;
	const narrowedEnd = rootListEnd - 1 - suffixSize;

	const changedChildStart = commonPrefixChildren;
	const changedChildEnd = newNode.childCount - commonSuffixChildren;
	const changedNodes: PMNode[] = [];
	for (let i = changedChildStart; i < changedChildEnd; i++) {
		changedNodes.push(newNode.child(i));
	}
	const narrowedFragment = Fragment.from(changedNodes);

	const prefixOffset = 1 + prefixSize;
	const adjustedContentStartOffsets = contentStartOffsets.map((offset) => offset - prefixOffset);

	return {
		start: narrowedStart,
		end: narrowedEnd,
		fragment: narrowedFragment,
		adjustedContentStartOffsets,
	};
}
