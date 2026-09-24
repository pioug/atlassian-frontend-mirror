import { expandSelectionToBlockRange } from '@atlaskit/editor-common/selection';
import type { Mark, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

import { isTransformDisabledBasedOnStepsConfig } from '../editor-commands/transform-node-utils/transform';
import { toNodeTypeValue } from '../editor-commands/transform-node-utils/types';
import type { NodeTypeName, TargetNodeMarks } from '../editor-commands/transform-node-utils/types';
import {
	getBlockNodesInRange,
	getTargetNodeTypeNameInContext,
} from '../editor-commands/transform-node-utils/utils';
import type { TransformNodeMarkChanges } from '../editor-commands/types';
import { getSingleTransformSourceNode, isExtensionTransformSource } from './transformSource';
import type { BlockMenuTransformSourceRegistry } from './transformSourceRegistry';

type TransformDisabledArgs = {
	selection: Selection;
	targetNodeMarkChanges?: TransformNodeMarkChanges;
	targetNodeTypeAttrs?: Record<string, unknown>;
	targetNodeTypeName: string;
	transformRegistry?: Pick<BlockMenuTransformSourceRegistry, 'resolve'>;
};

const getTargetMarks = (
	schema: Schema,
	currentMarks: readonly Mark[],
	marksToAdd?: TargetNodeMarks,
	marksToRemove?: string[],
): readonly Mark[] | undefined => {
	if (!marksToAdd && !marksToRemove) {
		return undefined;
	}

	let targetMarks = currentMarks;
	for (const name of marksToRemove ?? []) {
		const markType = schema.marks[name];
		if (markType) {
			targetMarks = markType.removeFromSet(targetMarks);
		}
	}

	for (const [name, attrs] of Object.entries(marksToAdd ?? {})) {
		const markType = schema.marks[name];
		if (markType) {
			targetMarks = markType.create(attrs).addToSet(markType.removeFromSet(targetMarks));
		}
	}

	return targetMarks;
};

export const canParentContainNodeType = (
	schema: Schema,
	selectedNodeTypeName: NodeTypeName,
	parentNode: PMNode,
	nodeTypeName: NodeTypeName,
	nodeTypeAttrs?: Record<string, unknown>,
	selectedNode?: PMNode,
	marksToAdd?: TargetNodeMarks,
	marksToRemove?: string[],
): boolean => {
	const adjustedNodeTypeName = getTargetNodeTypeNameInContext(
		nodeTypeName,
		true,
		parentNode,
		schema,
	);
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

	if (
		isExperimentEnabled('platform_editor_block_menu_small_text') &&
		selectedNode &&
		(marksToAdd || marksToRemove)
	) {
		const targetMarks = getTargetMarks(schema, selectedNode.marks, marksToAdd, marksToRemove);
		const targetNode = nodeType.createAndFill(nodeTypeAttrs, content, targetMarks);

		return Boolean(targetNode && parentNode.type.validContent(Fragment.from(targetNode)));
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
	marksToAdd: TargetNodeMarks | undefined,
	marksToRemove: string[] | undefined,
	isNested: boolean,
	parent: PMNode,
	schema: Schema,
): boolean => {
	const selectedNodeTypeName = toNodeTypeValue(node.type.name);
	if (!selectedNodeTypeName) {
		return false;
	}

	if (selectedNodeTypeName === targetNodeTypeName) {
		const removesTargetMarks = marksToRemove?.some((name) => {
			const markType = schema.marks[name];
			return markType ? Boolean(markType.isInSet(node.marks)) : false;
		});
		const addsOrReplacesTargetMarks = Object.entries(marksToAdd ?? {}).some(([name, attrs]) => {
			const markType = schema.marks[name];
			return markType ? !markType.isInSet(node.marks)?.eq(markType.create(attrs)) : false;
		});
		if (removesTargetMarks || addsOrReplacesTargetMarks) {
			if (
				isNested &&
				!canParentContainNodeType(
					schema,
					selectedNodeTypeName,
					parent,
					targetNodeTypeName,
					targetNodeTypeAttrs,
					node,
					marksToAdd,
					marksToRemove,
				)
			) {
				return false;
			}
			return true;
		}
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
			node,
			marksToAdd,
			marksToRemove,
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
	targetNodeMarkChanges,
	transformRegistry,
}: TransformDisabledArgs): boolean => {
	const { range } = expandSelectionToBlockRange(selection);
	if (!range) {
		return false;
	}

	const sourceNode = getSingleTransformSourceNode(selection, range);
	if (isExtensionTransformSource(sourceNode)) {
		return (
			transformRegistry?.resolve({
				source: sourceNode.toJSON(),
				targetTypeName: targetNodeTypeName,
			})?.status !== 'supported'
		);
	}

	const selectedNodes = getBlockNodesInRange(range);
	const parent = range.parent;
	const isNested = range.depth >= 1;
	const { schema } = selection.$from.doc.type;
	const { marksToAdd, marksToRemove } = targetNodeMarkChanges ?? {};

	const supportedTargetNodeTypeName = toNodeTypeValue(targetNodeTypeName);
	if (!supportedTargetNodeTypeName) {
		return true;
	}

	const isEnabledForAnyNode = selectedNodes.some((node) =>
		isTransformEnabledForNode(
			node,
			supportedTargetNodeTypeName,
			targetNodeTypeAttrs,
			marksToAdd,
			marksToRemove,
			isNested,
			parent,
			schema,
		),
	);

	return !isEnabledForAnyNode;
};
