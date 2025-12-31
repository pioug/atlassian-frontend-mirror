import {
	type Node as PMNode,
	type NodeType,
	type Schema,
} from '@atlaskit/editor-prosemirror/model';

import { getTargetNodeTypeNameInContext } from '../transform-node-utils/utils';

import { flattenStep } from './flattenStep';
import { applyTargetTextTypeStep } from './steps/applyTargetTextTypeStep';
import { convertEachNodeStep } from './steps/convertEachNodeStep';
import { decisionListToListStep } from './steps/decisionListToListStep';
import { flattenListStep } from './steps/flattenListStep';
import { listToDecisionListStep } from './steps/listToDecisionListStep';
import { listToListStep } from './steps/listToListStep';
import { mergeNeighbourListsStep } from './steps/mergeNeighbourListsStep';
import { unwrapLayoutStep } from './steps/unwrapLayoutStep';
import { unwrapListStep } from './steps/unwrapListStep';
import { wrapBlockquoteToDecisionListStep } from './steps/wrapBlockquoteToDecisionListStep';
import { wrapMixedContentStep } from './steps/wrapMixedContentStep';
import { wrapTextToCodeblockStep } from './steps/wrapTextToCodeblock';
import type { NodeCategory, NodeTypeName, TransformStepContext, TransformStep } from './types';
import { getNodeName, NODE_CATEGORY_BY_TYPE, toNodeTypeValue } from './types';
import { unwrapExpandStep } from './unwrapExpandStep';
import { unwrapStep } from './unwrapStep';
import { wrapIntoLayoutStep } from './wrapIntoLayoutStep';
import { wrapIntoListStep } from './wrapIntoListStep';
import { wrapStep } from './wrapStep';

// Transform steps for combinations of node categories (block/container/list/text)
const TRANSFORM_STEPS: Record<NodeCategory, Record<NodeCategory, TransformStep[] | undefined>> = {
	atomic: {
		atomic: undefined,
		container: [wrapStep],
		list: [wrapIntoListStep],
		text: undefined,
		multi: undefined,
	},
	container: {
		atomic: undefined,
		container: [unwrapStep, wrapStep],
		list: undefined,
		text: [unwrapStep, applyTargetTextTypeStep],
		multi: undefined,
	},
	list: {
		atomic: undefined,
		container: [wrapStep],
		list: [listToListStep],
		text: [flattenListStep, unwrapListStep, applyTargetTextTypeStep],
		multi: undefined,
	},
	text: {
		atomic: undefined,
		container: [wrapMixedContentStep],
		list: [wrapIntoListStep],
		text: [flattenStep, applyTargetTextTypeStep],
		multi: undefined,
	},
	multi: {
		atomic: undefined,
		container: [wrapMixedContentStep],
		list: [convertEachNodeStep, mergeNeighbourListsStep],
		text: [convertEachNodeStep],
		multi: undefined,
	},
};

// Transform steps for specific pairs of node types that cannot be processed
// using generic rules/steps from TRANSFORM_STEPS.
// Use 'null' to indicate unavailable transfrorm for a case where TRANSFORM_STEPS are not undefined.
const TRANSFORM_STEPS_OVERRIDE: Partial<
	Record<NodeTypeName, Partial<Record<NodeTypeName, TransformStep[] | null | undefined>>>
> = {
	paragraph: {
		paragraph: null,
		codeBlock: [wrapTextToCodeblockStep],
		layoutSection: [wrapIntoLayoutStep],
	},
	heading: {
		codeBlock: [wrapTextToCodeblockStep],
		layoutSection: [wrapIntoLayoutStep],
	},
	panel: {
		panel: null,
		layoutSection: [unwrapStep, wrapIntoLayoutStep],
		codeBlock: [unwrapStep, flattenStep, wrapStep],
		blockquote: [unwrapStep, wrapMixedContentStep],
		taskList: null,
		bulletList: null,
		orderedList: null,
		heading: null,
	},
	expand: {
		expand: null,
		panel: [unwrapExpandStep, wrapMixedContentStep],
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		layoutSection: [unwrapExpandStep, wrapIntoLayoutStep],
		paragraph: [unwrapExpandStep],
		codeBlock: null,
		heading: null,
	},
	nestedExpand: {
		expand: null,
		nestedExpand: null,
		panel: [unwrapExpandStep, wrapMixedContentStep],
		blockquote: [unwrapExpandStep, wrapMixedContentStep],
		paragraph: [unwrapExpandStep],
		codeBlock: null,
		heading: null,
	},
	blockquote: {
		blockquote: null,
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapIntoLayoutStep],
		codeBlock: null,
		decisionList: [unwrapStep, wrapBlockquoteToDecisionListStep],
	},
	layoutSection: {
		layoutSection: null,
		blockquote: [unwrapLayoutStep, wrapMixedContentStep],
		expand: [unwrapLayoutStep, wrapStep],
		panel: [unwrapLayoutStep, wrapMixedContentStep],
		codeBlock: null,
		paragraph: [unwrapLayoutStep],
		heading: null,
	},
	codeBlock: {
		codeBlock: null,
		blockquote: [wrapStep],
		expand: [wrapStep],
		nestedExpand: [wrapStep],
		layoutSection: [wrapIntoLayoutStep],
		panel: [wrapStep],
		heading: null,
	},
	bulletList: {
		bulletList: null,
		codeBlock: null,
		layoutSection: [wrapIntoLayoutStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		heading: null,
	},
	orderedList: {
		orderedList: null,
		codeBlock: null,
		layoutSection: [wrapIntoLayoutStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		heading: null,
	},
	taskList: {
		blockquote: null,
		codeBlock: null,
		layoutSection: [wrapIntoLayoutStep],
		decisionList: [flattenListStep, listToDecisionListStep],
		heading: null,
		taskList: null,
	},
	table: {
		layoutSection: [wrapIntoLayoutStep],
		blockquote: null,
		panel: null,
		codeBlock: null,
		orderedList: null,
		bulletList: null,
		taskList: null,
		decisionList: null,
	},
	mediaSingle: {
		layoutSection: [wrapIntoLayoutStep],
		codeBlock: null,
		decisionList: null,
		taskList: null,
	},
	mediaGroup: {
		layoutSection: [wrapIntoLayoutStep],
		codeBlock: null,
		decisionList: null,
		bulletList: null,
		orderedList: null,
		taskList: null,
	},
	decisionList: {
		decisionList: null,
		bulletList: [decisionListToListStep],
		orderedList: [decisionListToListStep],
		taskList: [decisionListToListStep],
		layoutSection: [wrapIntoLayoutStep],
	},
	blockCard: {
		layoutSection: [wrapIntoLayoutStep],
		blockquote: null,
		codeBlock: null,
		orderedList: null,
		bulletList: null,
		taskList: null,
		decisionList: null,
	},
	embedCard: {
		layoutSection: [wrapIntoLayoutStep],
		blockquote: null,
		panel: null,
		codeBlock: null,
		orderedList: null,
		bulletList: null,
		taskList: null,
		decisionList: null,
	},
	extension: {
		layoutSection: [wrapIntoLayoutStep],
		codeBlock: null,
		decisionList: null,
		taskList: null,
		orderedList: null,
		bulletList: null,
	},
	bodiedExtension: {
		layoutSection: [wrapIntoLayoutStep],
		blockquote: null,
		expand: null,
		panel: null,
		codeBlock: null,
		orderedList: null,
		bulletList: null,
		taskList: null,
		decisionList: null,
	},
	multi: {
		// TODO: EDITOR-4140 - Implement multiple paragraphs/headings/codeblocks to heading transform
		heading: null,
		// TODO: EDITOR-4141 - Implement multiple codeblocks/headings to paragraph transform
		paragraph: null,
		// TODO: EDITOR-4138 - Implement multi content to layout transform
		layoutSection: undefined,
	},
};

const getTransformStepsForNodeTypes = (
	selectedNodeTypeName: NodeTypeName,
	targetNodeTypeName: NodeTypeName,
) => {
	const fromCategory = NODE_CATEGORY_BY_TYPE[selectedNodeTypeName];
	const toCategory = NODE_CATEGORY_BY_TYPE[targetNodeTypeName];

	const overrideSteps = TRANSFORM_STEPS_OVERRIDE[selectedNodeTypeName]?.[targetNodeTypeName];
	if (overrideSteps === null) {
		return null;
	}

	const steps: TransformStep[] | undefined =
		overrideSteps ?? TRANSFORM_STEPS[fromCategory][toCategory];

	return steps;
};

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

	const steps = getTransformStepsForNodeTypes(selectedNodeTypeName, targetNodeTypeName);

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
	const steps = getTransformStepsForNodeTypes(selectedNodeType, targetNodeType);
	if (!steps || steps.length === 0) {
		return true;
	}
	return false;
};
