import type { ADFNode } from '../../adfNode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getNodeNames(node: ADFNode<any>): Array<string> {
	const nodeNames: Array<string> = [];

	if (node.isStage0Only()) {
		nodeNames.push(node.getName(true));
		return nodeNames;
	}

	nodeNames.push(node.getName());

	if (node.hasStage0()) {
		nodeNames.push(node.getName(true));
	}

	return nodeNames;
}
