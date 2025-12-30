import type { NodeType, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { getOutputNodes } from './transform';

export const tranformContent = (
	content: Fragment,
	targetNodeType: NodeType,
	schema: Schema,
	isNested: boolean,
	targetAttrs?: Record<string, unknown>,
	parent?: PMNode,
): Fragment => {
	const outputNodes = getOutputNodes({
		sourceNodes: Array.from(content.content),
		targetNodeType,
		schema,
		isNested,
		targetAttrs,
		parentNode: parent,
	});

	return outputNodes ? Fragment.fromArray(outputNodes) : content;
};
