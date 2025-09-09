import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';

import { transformBlockNode } from './block-transforms';
import { transformContainerNode, unwrapAndConvertToList } from './container-transforms';
import { convertToLayout, transformLayoutNode } from './layout-transforms';
import { transformListNode } from './list-transforms';
import type { FormatNodeTargetType, TransformContext } from './types';
import {
	getTargetNodeInfo,
	isBlockNode,
	isListNode,
	isListNodeType,
	isContainerNode,
	isLayoutNodeType,
	isLayoutNode,
} from './utils';

export function transformNodeToTargetType(
	tr: Transaction,
	sourceNode: PMNode,
	sourcePos: number,
	targetType: FormatNodeTargetType,
): Transaction | null {
	const { nodes } = tr.doc.type.schema;

	const targetNodeInfo = getTargetNodeInfo(targetType, nodes);
	if (!targetNodeInfo) {
		return null;
	}

	const { nodeType: targetNodeType, attrs: targetAttrs } = targetNodeInfo;

	// Early return if trying to transform to the same type
	if (sourceNode.type.name === targetNodeType.name) {
		// For headings, also check if the level matches
		if (targetNodeType.name === 'heading') {
			const sourceLevel = sourceNode.attrs?.level;
			const targetLevel = targetAttrs?.level;
			if (sourceLevel === targetLevel) {
				return tr;
			}
		} else {
			return tr;
		}
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
		if (isLayoutNodeType(targetNodeType)) {
			return convertToLayout(transformationContext);
		}

		// special case codeblock to listType
		if (sourceNode.type.name === 'codeBlock' && isListNodeType(targetNodeType)) {
			return unwrapAndConvertToList(transformationContext);
		}
		if (isLayoutNode(sourceNode)) {
			return transformLayoutNode(transformationContext);
		}

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
	} catch {
		// Node transformation failed
		return null;
	}
}
