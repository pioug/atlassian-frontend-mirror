import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';

import { isTransformDisabledBasedOnStepsConfig } from '../editor-commands/transform-node-utils/transform';
import { toNodeTypeValue, type NodeTypeName } from '../editor-commands/transform-node-utils/types';
import {
	getBlockNodesInRange,
	getTargetNodeTypeNameInContext,
} from '../editor-commands/transform-node-utils/utils';

type TransformDisabledArgs = {
	selection: Selection;
	targetNodeTypeAttrs?: Record<string, unknown>;
	targetNodeTypeName: string;
};

export const canParentContainNodeType = (
	schema: Schema,
	selectedNodeTypeName: NodeTypeName,
	parentNode: PMNode,
	nodeTypeName: NodeTypeName,
	nodeTypeAttrs?: Record<string, unknown>,
) => {
	const adjustedNodeTypeName =
		parentNode.type.name === 'layoutColumn' || parentNode.type.name === 'bodiedSyncBlock'
			? nodeTypeName
			: getTargetNodeTypeNameInContext(nodeTypeName, true);

	if (!adjustedNodeTypeName) {
		return false;
	}

	const nodeType = schema.nodes[adjustedNodeTypeName];

	let content = null;
	const nodesThatCantBeNestedInNestedExpand = ['blockCard', 'embedCard', 'table'];
	if (
		nodesThatCantBeNestedInNestedExpand.includes(selectedNodeTypeName) &&
		(adjustedNodeTypeName === 'expand' || adjustedNodeTypeName === 'nestedExpand')
	) {
		const node = schema.nodes[selectedNodeTypeName];
		content = node.createAndFill();
	}

	return parentNode.type.validContent(
		Fragment.from(nodeType.createAndFill(nodeTypeAttrs, content)),
	);
};

const isHeadingToHeadingTransformEnabled = (
	selectedNode: PMNode,
	targetNodeTypeAttrs?: Record<string, unknown>,
): boolean => {
	const selectedLevel = selectedNode.attrs?.level;
	const targetLevel = targetNodeTypeAttrs?.level;

	if (selectedLevel === undefined || targetLevel === undefined) {
		return false;
	}

	return selectedLevel !== targetLevel;
};

const isTransformEnabledForNode = (
	node: PMNode,
	targetNodeTypeName: NodeTypeName,
	targetNodeTypeAttrs: Record<string, unknown> | undefined,
	isNested: boolean,
	parent: PMNode,
	schema: Schema,
): boolean => {
	const selectedNodeTypeName = toNodeTypeValue(node.type.name);
	if (!selectedNodeTypeName) {
		return false;
	}

	const isDisabledByStepsConfig = isTransformDisabledBasedOnStepsConfig(
		selectedNodeTypeName,
		targetNodeTypeName,
	);
	if (isDisabledByStepsConfig) {
		return false;
	}

	if (selectedNodeTypeName === 'heading' && targetNodeTypeName === 'heading') {
		return isHeadingToHeadingTransformEnabled(node, targetNodeTypeAttrs);
	}

	if (
		isNested &&
		!canParentContainNodeType(
			schema,
			selectedNodeTypeName,
			parent,
			targetNodeTypeName,
			targetNodeTypeAttrs,
		)
	) {
		return false;
	}

	return true;
};

export const isTransformToTargetDisabled = ({
	selection,
	targetNodeTypeName,
	targetNodeTypeAttrs,
}: TransformDisabledArgs): boolean => {
	const { range } = expandSelectionToBlockRange(selection);
	if (!range) {
		return false;
	}

	const selectedNodes = getBlockNodesInRange(range);
	const parent = range.parent;
	const isNested = range.depth >= 1;
	const { schema } = selection.$from.doc.type;

	const supportedTargetNodeTypeName = toNodeTypeValue(targetNodeTypeName);
	if (!supportedTargetNodeTypeName) {
		return true;
	}

	const isEnabledForAnyNode = selectedNodes.some((node) =>
		isTransformEnabledForNode(
			node,
			supportedTargetNodeTypeName,
			targetNodeTypeAttrs,
			isNested,
			parent,
			schema,
		),
	);

	return !isEnabledForAnyNode;
};
