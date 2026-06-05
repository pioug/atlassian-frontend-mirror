import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

/**
 *
 * @param tableNode
 * @example
 */
export function hasMergedCell(tableNode: PmNode): boolean {
	let hasSpan = false;

	tableNode.descendants((node) => {
		if (node.type.name === 'tableRow') {
			return true;
		}

		const { colspan, rowspan } = node.attrs;

		if (colspan > 1 || rowspan > 1) {
			hasSpan = true;
		}

		return false;
	});

	return hasSpan;
}
