import type { Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';

const importSources = new Set([
	'@atlaskit/primitives',
	'@atlaskit/primitives/xcss',
	'@atlaskit/primitives/xcss/xcss',
]);

export function isXcssValue(node: Rule.Node, context: Rule.RuleContext): boolean {
	let current = node;
	while (current.parent) {
		const parent = current.parent;
		if (parent.type === 'Property' && parent.value === current) {
			current = parent;
		} else if (parent.type === 'ObjectExpression') {
			current = parent;
		} else {
			break;
		}
	}

	const call = current.parent;
	if (call?.type !== 'CallExpression' || call.arguments[0] !== current) {
		return false;
	}

	const callee = call.callee;
	const isNamespaceCall =
		callee.type === 'MemberExpression' &&
		!callee.computed &&
		callee.property.type === 'Identifier' &&
		callee.property.name === 'xcss';
	const identifier = callee.type === 'Identifier' ? callee : isNamespaceCall ? callee.object : null;
	if (identifier?.type !== 'Identifier') {
		return false;
	}

	const variable = findVariable({ identifier, sourceCode: getSourceCode(context) });
	return (
		variable?.defs.some(
			(def) =>
				def.type === 'ImportBinding' &&
				def.parent?.type === 'ImportDeclaration' &&
				importSources.has(String(def.parent.source.value)) &&
				(isNamespaceCall
					? def.node.type === 'ImportNamespaceSpecifier'
					: def.node.type === 'ImportSpecifier' &&
						def.node.imported.type === 'Identifier' &&
						def.node.imported.name === 'xcss'),
		) ?? false
	);
}
