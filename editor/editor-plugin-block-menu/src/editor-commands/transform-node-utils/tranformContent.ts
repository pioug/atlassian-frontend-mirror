import type { NodeType, Schema } from '@atlaskit/editor-prosemirror/model';
import { Fragment } from '@atlaskit/editor-prosemirror/model';

import { getOutputNodes } from './transform';

export const tranformContent = (
	content: Fragment,
	targetNodeType: NodeType,
	schema: Schema,
	isNested: boolean,
	targetAttrs?: Record<string, unknown>,
): Fragment => {
	const outputNodes = getOutputNodes({
		sourceNodes: Array.from(content.content),
		targetNodeType,
		schema,
		isNested,
		targetAttrs,
	});

	return outputNodes ? Fragment.fromArray(outputNodes) : content;
};
