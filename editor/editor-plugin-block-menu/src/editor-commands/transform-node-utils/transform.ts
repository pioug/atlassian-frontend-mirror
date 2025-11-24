import type { Node as PMNode, NodeType, Schema } from '@atlaskit/editor-prosemirror/model';

import { stubStep } from './stubStep';
import type { NodeCategory, NodeTypeName, TransformStepContext, TransformStep } from './types';
import { NODE_CATEGORY_BY_TYPE, toNodeTypeValue } from './types';

// Exampled step for overrides:
// - open Block menu on a paragraph, click 'Panel' in the Turn into'
// - expected to put paragraph into a panel
const wrapIntoPanelStep: TransformStep = (nodes, context) => {
	const newNode = context.schema.nodes.panel.createAndFill({}, nodes);
	return newNode ? [newNode] : [];
};

// Transform steps for combinations of node categories (block/container/list/text)
const TRANSFORM_STEPS: Record<NodeCategory, Record<NodeCategory, TransformStep[] | undefined>> = {
	atomic: {
		atomic: undefined,
		container: [stubStep],
		list: undefined,
		text: undefined,
	},
	container: {
		atomic: undefined,
		container: [stubStep],
		list: undefined,
		text: undefined,
	},
	list: {
		atomic: undefined,
		container: [stubStep],
		list: [stubStep],
		text: [stubStep],
	},
	text: {
		atomic: undefined,
		container: [stubStep],
		list: [stubStep],
		text: [stubStep],
	},
};

// Transform steps for specific pairs of node types that cannot be processed
// using generic rules/steps from TRANSFORM_STEPS.
const TRANSFORM_STEPS_OVERRIDE: Partial<
	Record<NodeTypeName, Partial<Record<NodeTypeName, TransformStep[] | undefined>>>
> = {
	paragraph: {
		panel: [wrapIntoPanelStep],
	},
};

const getTransformStepsForNodeTypes = (
	selectedNodeTypeName: NodeTypeName,
	targetNodeTypeName: NodeTypeName,
) => {
	const fromCategory = NODE_CATEGORY_BY_TYPE[selectedNodeTypeName];
	const toCategory = NODE_CATEGORY_BY_TYPE[targetNodeTypeName];

	const steps: TransformStep[] | undefined =
		TRANSFORM_STEPS_OVERRIDE[selectedNodeTypeName]?.[targetNodeTypeName] ??
		TRANSFORM_STEPS[fromCategory][toCategory];

	return steps;
};

interface GetOutputNodesArgs {
	schema: Schema;
	sourceNode: PMNode;
	targetNodeType: NodeType;
}

// Note: Currently works only for single node in the selection
export const getOutputNodes = ({
	sourceNode,
	targetNodeType,
	schema,
}: GetOutputNodesArgs): PMNode[] | undefined => {
	const nodesToReplace = [sourceNode];
	const selectedNodeTypeName = toNodeTypeValue(sourceNode.type.name);
	const targetNodeTypeName = toNodeTypeValue(targetNodeType.name);

	if (!selectedNodeTypeName || !targetNodeTypeName) {
		// We may decide to return an empty array or undefined here
		return;
	}

	const steps = getTransformStepsForNodeTypes(selectedNodeTypeName, targetNodeTypeName);

	const context: TransformStepContext = {
		fromNode: sourceNode,
		targetNodeTypeName,
		schema,
	};

	if (!steps || steps.length === 0) {
		return;
	}

	return steps.reduce((nodes, step) => {
		return step(nodes, context);
	}, nodesToReplace);
};
