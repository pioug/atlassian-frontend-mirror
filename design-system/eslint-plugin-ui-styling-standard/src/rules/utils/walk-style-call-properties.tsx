import type * as ESTree from 'eslint-codemod-utils';

import type { StyleCall } from './style-calls';

export function walkStyleCallProperties(
	styleCall: StyleCall,
	visitor: (property: ESTree.Property) => void,
	options?: { includeTopLevel?: boolean },
): void {
	const skipTopLevel =
		!options?.includeTopLevel &&
		(styleCall.styleFunction === 'cssMap' || styleCall.styleFunction === 'keyframes');

	for (const argument of styleCall.node.arguments) {
		if (argument.type === 'ObjectExpression') {
			walkStyleObject(argument, visitor, skipTopLevel);
		} else if (
			argument.type === 'ArrowFunctionExpression' &&
			argument.expression &&
			argument.body.type === 'ObjectExpression'
		) {
			walkStyleObject(argument.body, visitor, skipTopLevel);
		}
	}
}

function walkStyleObject(
	object: ESTree.ObjectExpression,
	visitor: (property: ESTree.Property) => void,
	skipVisitor: boolean,
): void {
	for (const property of object.properties) {
		if (property.type !== 'Property') {
			continue;
		}

		if (!skipVisitor) {
			visitor(property);
		}

		if (property.value.type === 'ObjectExpression') {
			walkStyleObject(property.value, visitor, false);
		}
	}
}
