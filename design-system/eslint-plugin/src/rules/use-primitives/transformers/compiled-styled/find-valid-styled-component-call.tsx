import type { Rule } from 'eslint';
import { closestOfType, isNodeOfType, type VariableDeclarator } from 'eslint-codemod-utils';

import * as supported from './supported';

/**
 * returns a variable reference if preconditions are favourable for
 * the transformation to proceed, undefined otherwise.
 */

export const findValidStyledComponentCall = (
	node: Rule.Node,
): (VariableDeclarator & Rule.NodeParentExtension) | undefined => {
	// halts unless we are dealing with a styled component
	if (!isStyledCallExpression(node)) {
		return;
	}
	// halts if the component is being exported directly
	if (closestOfType(node, 'ExportNamedDeclaration')) {
		return;
	}

	const styledComponentVariableRef = node.parent;
	// halts if the styled component is not assigned to a variable immediately
	if (!isNodeOfType(styledComponentVariableRef, 'VariableDeclarator')) {
		return;
	}
	return styledComponentVariableRef;
};

/**
 * Some verbose precondition checks but all it does is check
 * a call expression is of form `styled.div` or `styled2.div`
 *
 * In the future it could be enhanced to double check `styled` and `styled2`
 * are Compiled imports but as is should work for the majority of use cases
 * https://product-fabric.atlassian.net/browse/DSP-16058
 */
const isStyledCallExpression = (call: Rule.Node): boolean => {
	if (!isNodeOfType(call, 'CallExpression')) {
		return false;
	}
	if (!isNodeOfType(call.callee, 'MemberExpression')) {
		return false;
	}
	if (
		!isNodeOfType(call.callee.object, 'Identifier') ||
		!isNodeOfType(call.callee.property, 'Identifier')
	) {
		return false;
	}

	if (
		/^styled2?$/.test(call.callee.object.name) &&
		supported.elements.includes(call.callee.property.name)
	) {
		return true;
	}

	return false;
};
