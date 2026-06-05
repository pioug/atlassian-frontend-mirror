import type { Node } from '@atlaskit/editor-prosemirror/model';

export function filterChildrenBetween(
	doc: Node,
	from: number,
	to: number,
	predicate: (node: Node, pos: number, parent: Node | null) => boolean | undefined,
): {
	node: Node;
	pos: number;
}[] {
	const results = [] as { node: Node; pos: number }[];
	doc.nodesBetween(from, to, (node, pos, parent) => {
		if (predicate(node, pos, parent)) {
			results.push({ node, pos });
		}
	});
	return results;
}
