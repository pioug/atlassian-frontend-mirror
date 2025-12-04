import {
	type Node as PMNode,
	type NodeType,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';

import { getTargetNodeTypeNameInContext } from '../transform-node-utils/utils';

import { flattenListStep } from './flattenListStep';
import { flattenStep } from './flattenStep';
import { stubStep } from './stubStep';
import type { NodeCategory, NodeTypeName, TransformStepContext, TransformStep } from './types';
import { NODE_CATEGORY_BY_TYPE, toNodeTypeValue } from './types';
import { unwrapExpandStep } from './unwrapExpandStep';
import { unwrapListStep } from './unwrapListStep';
import { unwrapStep } from './unwrapStep';
import { wrapInExpandStep } from './wrapInExpandStep';
import { wrapIntoLayoutStep } from './wrapIntoLayoutStep';
import { wrapStep } from './wrapStep';

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
		container: [unwrapStep, wrapStep],
		list: undefined,
		text: [unwrapStep],
	},
	list: {
		atomic: undefined,
		container: [stubStep],
		list: [stubStep],
		text: [flattenListStep, unwrapListStep],
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
	panel: {
		layoutSection: [unwrapStep, wrapIntoLayoutStep],
		codeBlock: [unwrapStep, flattenStep, wrapStep],
	},
	expand: {
		panel: [unwrapExpandStep, wrapStep],
		blockquote: [unwrapExpandStep, wrapStep],
		layoutSection: [unwrapExpandStep, wrapIntoLayoutStep],
		paragraph: [unwrapExpandStep],
		codeBlock: [unwrapExpandStep, flattenStep, wrapStep],
	},
	nestedExpand: {
		panel: [unwrapExpandStep, wrapStep],
		blockquote: [unwrapExpandStep, wrapStep],
		paragraph: [unwrapExpandStep],
		codeBlock: [unwrapExpandStep, flattenStep, wrapStep],
	},
	blockquote: {
		expand: [wrapInExpandStep],
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
	isNested: boolean;
	schema: Schema;
	sourceNode: PMNode;
	targetNodeType: NodeType;
}

// Note: Currently works only for single node in the selection
export const getOutputNodes = ({
	sourceNode,
	targetNodeType,
	schema,
	isNested,
}: GetOutputNodesArgs): PMNode[] | undefined => {
	const nodesToReplace = [sourceNode];

	const selectedNodeTypeName = toNodeTypeValue(sourceNode.type.name);
	let targetNodeTypeName = toNodeTypeValue(targetNodeType.name);
	targetNodeTypeName = getTargetNodeTypeNameInContext(targetNodeTypeName, isNested);

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
		const result = step(nodes, context);
		return result;
	}, nodesToReplace);
};
