import { ADFNode } from './adfNode';
import type { ADFNodeGroup } from './types/ADFNodeGroup';
import type { ADFNodeContentRangeSpec, ADFNodeContentSpec } from './types/ADFNodeSpec';

export type ADFVisitor<N = unknown, G = unknown, C = unknown> = {
	$onePlus?: (content: C) => C;
	$or?: (content: Array<N | G>) => C;
	$range?: (item: ADFNodeContentRangeSpec, content: C) => C;
	$zeroPlus?: (content: C) => C;
	group?: (group: ADFNodeGroup, nodes: Array<N>) => G;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node?: (node: ADFNode<any>, children: Array<C>, cycle?: true) => N;
};

/**
 * Implements post-order traversal of an ADF DSL tree.
 *
 * Traverse accepts a root node of the ADF DSL tree and a visitor object.
 * Visitor is a pattern that is commonly used in tree traversal algorithms.
 * It allows to separate the traversal logic from the actual processing logic.
 *
 * The visitor object should have the following methods:
 * - node(node, children, cycle) - called for each node in the tree
 *   - node - the node being visited
 *   - children - an array of processed children of the node
 *   - cycle - a flag indicating that the node is being visited again due to a cycle
 * - group(group, nodes) - called for each group in the tree
 *   - group - the group being visited
 *   - nodes - an array of processed nodes in the group
 * - $or(content) - called for each $or content in the tree
 *   - content - an array of processed nodes or groups
 * - $onePlus(content) - called for each $one+ content in the tree
 *   - content - the processed content
 * - $zeroPlus(content) - called for each $zero+ content in the tree
 *   - content - the processed content
 * - $range(item, content) - called for each $range content in the tree
 *   - item - the range content item, includes the range metadata – min and max
 *   - content - the processed content
 *
 * How does it deal with cycles?
 *
 * In order to deal with cyclic structure we stop processing children if the node was seen before.
 * That allows us to still return something meaningful to a parent node without falling into a cycle.
 *
 * Example usage:
 * const doc = adfNode('doc').definine({root: true});
 *
 * traverse(doc, {
 *    node(node, children) {},
 *    group(group, nodes) {},
 *    $or(content) {},
 *    $onePlus(content) {},
 *    $zeroPlus(content) {},
 *    $range(item, content) {},
 * })
 */
export function traverse<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType>(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	node: ADFNode<any>,
	visitor: ADFVisitor<NodeVisitorReturnType, GroupVisitorReturnType, ContentVisitorReturnType>,
): void {
	const visited = new Set<string>();
	if (!node.isRoot()) {
		// eslint-disable-next-line no-console
		console.log('root', node.getSpec());
		throw new Error(
			`Cannot start traverse from a node that is not a root node. Node type: ${node.getType()}`,
		);
	}

	traverseNode(node, visitor as ADFVisitor, visited);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function traverseNode(node: ADFNode<any>, visitor: ADFVisitor, visited: Set<string>): any {
	if (visited.has(node.getName())) {
		// in order to break a cycle, once we visit the same node again,
		// we are then just processing the node itself, without its children
		// also we are passing a cycle flag to the visitor, so the logic can be adjusted accordingly
		return visitor?.node?.(node, [], true);
	}

	if (!node.isDefined()) {
		throw new Error(
			`Cannot traverse a node that was not defined, call node.define(spec) first. Node type: ${node.getType()}`,
		);
	}

	const children = [];
	visited.add(node.getName());
	if (node.getSpec()?.content) {
		for (const child of node.getSpec()?.content ?? []) {
			children.push(traverseNodeContent(child, visitor, visited));
		}
	}
	return visitor?.node?.(node, children);
}

function traverseNodeContent(item: ADFNodeContentSpec, visitor: ADFVisitor, visited: Set<string>) {
	if (item.type === '$or' && Array.isArray(item.content)) {
		const children = [];
		for (const child of item.content) {
			if (child instanceof ADFNode) {
				children.push(traverseNode(child, visitor, visited));
			} else {
				children.push(traverseGroup(child, visitor, visited));
			}
		}
		return visitor.$or?.(children);
	}

	if (!Array.isArray(item.content)) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const child: any = traverseNodeContent(item.content, visitor, visited);
		if (item.type === '$one+') {
			return visitor?.$onePlus?.(child);
		}
		if (item.type === '$zero+') {
			return visitor?.$zeroPlus?.(child);
		}
		if (item.type === '$range') {
			return visitor?.$range?.(item as ADFNodeContentRangeSpec, child);
		}
	}
}

function traverseGroup(group: ADFNodeGroup, visitor: ADFVisitor, visited: Set<string>) {
	const children = [];
	for (const child of group.members) {
		if (child instanceof ADFNode) {
			children.push(traverseNode(child, visitor, visited));
		}
	}
	return visitor?.group?.(group, children);
}
