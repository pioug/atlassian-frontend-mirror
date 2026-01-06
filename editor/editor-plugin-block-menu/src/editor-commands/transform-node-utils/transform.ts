import {
	type Node as PMNode,
	type NodeType,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';

import { getTargetNodeTypeNameInContext } from '../transform-node-utils/utils';

import { TRANSFORMATION_MATRIX } from './TRANSFORMATION_MATRIX';
import type { NodeTypeName, TransformStepContext } from './types';
import { getNodeName, toNodeTypeValue } from './types';

interface GetOutputNodesArgs {
	isNested: boolean;
	parentNode?: PMNode;
	schema: Schema;
	sourceNodes: PMNode[];
	targetAttrs?: Record<string, unknown>;
	targetNodeType: NodeType;
}

/**
 * Convert a list of nodes to a target node type.
 * If no steps are found, the source nodes are returned unchanged.
 * If steps are found, they are applied to the source nodes in order.
 * If a step returns an empty array, the source nodes are returned.
 * If a step returns a non-empty array, that array is returned.
 * @param args - The conversion arguments
 * @param args.sourceNodes - The list of nodes to convert
 * @param args.targetNodeType - The type of node to convert into
 * @param args.schema - The schema to use for the conversion
 * @param args.isNested - Whether the conversion is nested
 * @param args.targetAttrs - The attributes to use for the conversion
 * @param args.parentNode - The parent node of the selected node
 * @returns The converted list of nodes
 */
export const convertNodesToTargetType = ({
	sourceNodes,
	targetNodeType,
	schema,
	isNested,
	targetAttrs,
	parentNode,
}: GetOutputNodesArgs): PMNode[] => {
	const sourceNode = sourceNodes.at(0);

	if (!sourceNode) {
		return sourceNodes;
	}

	const selectedNodeTypeName = toNodeTypeValue(getNodeName(sourceNodes));
	const initialTargetNodeTypeName = toNodeTypeValue(targetNodeType.name);
	const targetNodeTypeName = getTargetNodeTypeNameInContext(
		initialTargetNodeTypeName,
		isNested,
		parentNode,
	);

	if (!selectedNodeTypeName || !targetNodeTypeName) {
		return sourceNodes;
	}

	const steps = TRANSFORMATION_MATRIX[selectedNodeTypeName][targetNodeTypeName];

	const context: TransformStepContext = {
		// sourceNode is incorrect now - what to do here?
		fromNode: sourceNode,
		targetNodeTypeName,
		schema,
		targetAttrs,
	};

	if (!steps || steps.length === 0) {
		return sourceNodes;
	}

	return steps.reduce((nodes, step) => {
		return step(nodes, context);
	}, sourceNodes);
};

export const isTransformDisabledBasedOnStepsConfig = (
	selectedNodeType: NodeTypeName,
	targetNodeType: NodeTypeName,
) => {
	const steps = TRANSFORMATION_MATRIX[selectedNodeType][targetNodeType];
	return !steps || steps.length === 0;
};
