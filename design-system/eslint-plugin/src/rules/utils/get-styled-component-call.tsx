import type { Rule } from 'eslint';
import { closestOfType, isNodeOfType, type VariableDeclarator } from 'eslint-codemod-utils';

/**
 * Returns a styled component
 */

export const getStyledComponentCall = (
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
 * a call expression is of form `styled.<element>` or `styled2.<element>`
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

	if (/^styled2?$/.test(call.callee.object.name)) {
		return true;
	}

	return false;
};
