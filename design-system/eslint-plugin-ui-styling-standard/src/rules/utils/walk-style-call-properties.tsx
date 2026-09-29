import type * as ESTree from 'eslint-codemod-utils';

import type { StyleCall } from './style-calls';
import { walkStyleObjectProperties } from './walk-style-object-properties';

export function walkStyleCallProperties(
	styleCall: StyleCall,
	visitor: (property: ESTree.Property) => void,
	options?: {
		includeTopLevel?: boolean;
		skipSubtree?: (property: ESTree.Property) => boolean;
	},
): void {
	const skipTopLevel =
		!options?.includeTopLevel &&
		(styleCall.styleFunction === 'cssMap' || styleCall.styleFunction === 'keyframes');
	const { skipSubtree } = options ?? {};

	for (const argument of styleCall.node.arguments) {
		if (argument.type === 'ObjectExpression') {
			walkStyleObjectProperties(argument, visitor, { skipTopLevel, skipSubtree });
		} else if (
			argument.type === 'ArrowFunctionExpression' &&
			argument.expression &&
			argument.body.type === 'ObjectExpression'
		) {
			walkStyleObjectProperties(argument.body, visitor, { skipTopLevel, skipSubtree });
		}
	}
}
