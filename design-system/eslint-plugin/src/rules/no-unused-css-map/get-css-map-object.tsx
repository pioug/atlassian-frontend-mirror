import type { Rule } from 'eslint';
import type { CallExpression as ESCallExpression, ObjectExpression } from 'estree';

type CallExpression = ESCallExpression & Rule.NodeParentExtension;

export const getCssMapObject = (node: CallExpression): ObjectExpression | undefined => {
	// We assume the argument `node` is already a cssMap() call.

	// Things like the number of arguments to cssMap and the type of
	// cssMap's argument are handled by the TypeScript compiler, so
	// we don't bother with creating eslint errors for these here

	if (node.arguments.length !== 1 || node.arguments[0].type !== 'ObjectExpression') {
		return;
	}

	return node.arguments[0];
};
