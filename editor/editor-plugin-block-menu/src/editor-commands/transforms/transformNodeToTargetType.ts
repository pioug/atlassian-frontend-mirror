import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { transformBlockNode } from './block-transforms';
import { transformContainerNode } from './container-transforms';
import { transformListNode } from './list-transforms';
import type { FormatNodeTargetType, TransformContext } from './types';
import { getTargetNodeInfo, isBlockNode, isListNode, isContainerNode } from './utils';

export function transformNodeToTargetType(
	tr: Transaction,
	sourceNode: PMNode,
	sourcePos: number | null,
	targetType: FormatNodeTargetType,
): Transaction | null {
	const { nodes } = tr.doc.type.schema;

	const targetNodeInfo = getTargetNodeInfo(targetType, nodes);
	if (!targetNodeInfo) {
		return null;
	}

	const { nodeType: targetNodeType, attrs: targetAttrs } = targetNodeInfo;

	// Early return if trying to transform to the same type
	if (sourceNode.type === targetNodeType) {
		return tr; // No transformation needed
	}

	// Prepare transformation context
	const transformationContext: TransformContext = {
		tr,
		sourceNode,
		sourcePos,
		targetNodeType,
		targetAttrs,
	};

	// Route to appropriate transformation strategy based on source node type
	try {
		if (isBlockNode(sourceNode)) {
			return transformBlockNode(transformationContext);
		}

		if (isListNode(sourceNode)) {
			return transformListNode(transformationContext);
		}

		if (isContainerNode(sourceNode)) {
			return transformContainerNode(transformationContext);
		}

		return null;
	} catch (e) {
		// Node transformation failed
		return null;
	}
}
