import type { Node as PMNode, NodeRange } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import {
	getBlockNodesInRange,
	getSelectedNode,
} from '../editor-commands/transform-node-utils/utils';

const EXTENSION_NODE_TYPES = new Set(['extension', 'bodiedExtension', 'multiBodiedExtension']);

export const getSingleTransformSourceNode = (
	selection: Selection,
	range: NodeRange | undefined,
): PMNode | undefined => {
	const selectedNode = getSelectedNode(selection)?.node;
	if (selectedNode) {
		return selectedNode;
	}

	if (!range) {
		return undefined;
	}

	const blockNodes = getBlockNodesInRange(range);
	return blockNodes.length === 1 ? blockNodes[0] : undefined;
};

export const isExtensionTransformSource = (node: PMNode | undefined): node is PMNode =>
	Boolean(node && EXTENSION_NODE_TYPES.has(node.type.name));
