import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';

/**
 *
 * @param tableNode
 * @example
 */
export function convertProsemirrorTableNodeToArrayOfRows(
	tableNode: PmNode,
): Array<Array<PmNode | null>> {
	const result: Array<Array<PmNode>> = [];

	tableNode.forEach((rowNode) => {
		if (rowNode.type.name === 'tableRow') {
			const row: Array<PmNode> = [];
			rowNode.forEach((n) => row.push(n));
			result.push(row);
		}
	});

	return result;
}
