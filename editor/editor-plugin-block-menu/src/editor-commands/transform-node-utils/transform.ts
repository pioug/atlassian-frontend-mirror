import { isNodeTypeValidChildOf } from '@atlaskit/editor-common/utils/node-type-utils';
import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { getTargetNodeTypeNameInContext } from '../transform-node-utils/utils';

import { TRANSFORMATION_MATRIX, TRANSFORMATION_MATRIX_PANEL_C1 } from './TRANSFORMATION_MATRIX';
import type { NodeTypeName, TargetNodeMarks, TransformStepContext } from './types';
import { getNodeName, toNodeTypeValue } from './types';

interface GetOutputNodesArgs {
	isNested: boolean;
	marksToAdd?: TargetNodeMarks;
	marksToRemove?: string[];
	parentNode?: PMNode;
	schema: Schema;
	sourceNodes: PMNode[];
	targetAttrs?: Record<string, unknown>;
	targetNodeType: NodeType;
}

const applyTargetNodeMarks = (
	node: PMNode,
	targetNodeType: NodeType,
	marksToAdd: TargetNodeMarks | undefined,
	marksToRemove: string[] | undefined,
	schema: Schema,
): PMNode => {
	let nextNode = node;

	if (node.type === targetNodeType) {
		const marksAfterRemovals = (marksToRemove ?? []).reduce((currentMarks, name) => {
			const markType = schema.marks[name];
			return markType ? markType.removeFromSet(currentMarks) : currentMarks;
		}, node.marks);
		const marks = Object.entries(marksToAdd ?? {}).reduce((currentMarks, [name, attrs]) => {
			const markType = schema.marks[name];
			return markType
				? markType.create(attrs).addToSet(markType.removeFromSet(currentMarks))
				: currentMarks;
		}, marksAfterRemovals);
		nextNode = node.mark(marks);
	}

	if (nextNode.childCount === 0) {
		return nextNode;
	}

	const children: PMNode[] = [];
	nextNode.forEach((child) =>
		children.push(applyTargetNodeMarks(child, targetNodeType, marksToAdd, marksToRemove, schema)),
	);
	return nextNode.copy(Fragment.fromArray(children));
};

// Upgrade broken-out panel nodes to panel_c1 if the parent node allows it
export const upgradePanelNodesToPanelC1 = (
	nodes: PMNode[],
	parentNode: PMNode | undefined,
	schema: Schema,
): PMNode[] => {
	if (
		!schema.nodes['panel_c1'] ||
		!expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
	) {
		return nodes;
	}
	return nodes.map((node) => {
		if (node.type.name === 'panel') {
			const shouldUsePanelC1 =
				!parentNode || isNodeTypeValidChildOf('panel_c1', parentNode, schema);
			if (shouldUsePanelC1) {
				return schema.nodes['panel_c1'].createAndFill(node.attrs, node.content, node.marks) ?? node;
			}
		}
		return node;
	});
};

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
 * @param args.marksToAdd - Block marks to add or replace on converted target nodes
 * @param args.marksToRemove - Block marks to remove from converted target nodes
 * @param args.parentNode - The parent node of the selected node
 * @returns The converted list of nodes
 */
export const convertNodesToTargetType = ({
	sourceNodes,
	targetNodeType,
	schema,
	isNested,
	targetAttrs,
	marksToAdd,
	marksToRemove,
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
		schema,
	);

	if (!selectedNodeTypeName || !targetNodeTypeName) {
		return sourceNodes;
	}

	const steps = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? TRANSFORMATION_MATRIX_PANEL_C1[selectedNodeTypeName][targetNodeTypeName]
		: TRANSFORMATION_MATRIX[selectedNodeTypeName][targetNodeTypeName];

	const context: TransformStepContext = {
		// sourceNode is incorrect now - what to do here?
		fromNode: sourceNode,
		targetNodeTypeName,
		schema,
		targetAttrs,
	};

	const shouldApplyTargetNodeMarkChanges =
		isExperimentEnabled('platform_editor_block_menu_small_text') &&
		Boolean(marksToAdd || marksToRemove);

	if (!shouldApplyTargetNodeMarkChanges) {
		if (!steps || steps.length === 0) {
			return sourceNodes;
		}

		const resultNodes = steps.reduce((nodes, step) => step(nodes, context), sourceNodes);
		return upgradePanelNodesToPanelC1(resultNodes, parentNode, schema);
	}

	const resultNodes =
		steps?.reduce((nodes, step) => step(nodes, context), sourceNodes) ?? sourceNodes;
	const upgradedNodes = steps?.length
		? upgradePanelNodesToPanelC1(resultNodes, parentNode, schema)
		: resultNodes;
	return upgradedNodes.map((node) =>
		applyTargetNodeMarks(node, targetNodeType, marksToAdd, marksToRemove, schema),
	);
};

export const isTransformDisabledBasedOnStepsConfig = (
	selectedNodeType: NodeTypeName,
	targetNodeType: NodeTypeName,
): boolean => {
	const steps = expValEquals('platform_editor_nest_table_in_panel', 'isEnabled', true)
		? TRANSFORMATION_MATRIX_PANEL_C1[selectedNodeType][targetNodeType]
		: TRANSFORMATION_MATRIX[selectedNodeType][targetNodeType];
	return !steps || steps.length === 0;
};
