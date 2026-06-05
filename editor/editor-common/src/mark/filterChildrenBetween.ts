import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

export function filterChildrenBetween(
	doc: PMNode,
	from: number,
	to: number,
	predicate: (node: PMNode, pos: number, parent: PMNode | null) => boolean | undefined,
): {
	node: PMNode;
	pos: number;
}[] {
	const results = [] as { node: PMNode; pos: number }[];
	doc.nodesBetween(from, to, (node, pos, _parent) => {
		if (predicate(node, pos, _parent)) {
			results.push({ node, pos });
		}
	});
	return results;
}
