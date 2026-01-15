import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';

import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { CSS_IN_JS_IMPORTS, isCssMap } from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

const IMPORT_SOURCES = [CSS_IN_JS_IMPORTS.compiled, CSS_IN_JS_IMPORTS.atlaskitCss];

/**
 * Gets the key name from a property node
 */
function getPropertyKeyName(property: ESTree.Property): string | null {
	if (property.key.type === 'Identifier') {
		return property.key.name;
	}
	if (property.key.type === 'Literal' && typeof property.key.value === 'string') {
		return property.key.value;
	}
	return null;
}

/**
 * Checks if a variable is exported from the module
 */
function isExported(
	node: ESTree.VariableDeclarator & Rule.NodeParentExtension,
	context: Rule.RuleContext,
): boolean {
	let parent: (Rule.Node & Rule.NodeParentExtension) | undefined = node.parent;

	// Walk up to find VariableDeclaration
	while (parent && parent.type !== 'VariableDeclaration') {
		parent = parent.parent;
	}

	if (!parent) {
		return false;
	}

	// Check if the VariableDeclaration is an ExportNamedDeclaration
	const grandParent = parent.parent;
	if (grandParent && grandParent.type === 'ExportNamedDeclaration') {
		return true;
	}

	// Check if the variable is exported elsewhere in the file via `export { styles }`
	if (node.id.type === 'Identifier') {
		const scope = getScope(context, node);
		const variableName = node.id.name;
		const variable = scope.variables.find((v) => v.name === variableName);

		if (variable) {
			// Check if any reference is a direct export specifier (e.g., `export { styles }`)
			return variable.references.some((ref) => {
				const refParent = (ref.identifier as ESTree.Identifier & Rule.NodeParentExtension).parent;
				// Check for direct export: `export { styles }` or `export { styles as something }`
				// In this case, the identifier's parent is an ExportSpecifier
				if (refParent && refParent.type === 'ExportSpecifier') {
					return true;
				}
				// Check for default export: `export default styles`
				if (refParent && refParent.type === 'ExportDefaultDeclaration') {
					return true;
				}
				return false;
			});
		}
	}

	return false;
}

export const rule = createLintRule({
	meta: {
		name: 'no-unused-cssmap-properties',
		docs: {
			description:
				'Detects unused properties in cssMap style objects that are not exported. Helps maintain clean code by identifying style variants that are defined but never used.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'unused-property': 'The "{{propertyName}}" style is defined but never used.',
		},
		type: 'problem',
	},
	create(context) {
		return {
			VariableDeclarator(node: Rule.Node) {
				if (node.type !== 'VariableDeclarator') {
					return;
				}

				// Only process if the initializer is a cssMap call
				if (
					!node.init ||
					node.init.type !== 'CallExpression' ||
					!isCssMap(node.init.callee, getScope(context, node).references, IMPORT_SOURCES)
				) {
					return;
				}

				// Skip if the cssMap is exported
				if (isExported(node, context)) {
					return;
				}

				// Get the cssMap argument (should be an object expression)
				const cssMapArg = node.init.arguments[0];
				if (!cssMapArg || cssMapArg.type !== 'ObjectExpression') {
					return;
				}

				// Get the variable name
				if (node.id.type !== 'Identifier') {
					return;
				}

				const variableName = node.id.name;

				// Use getDeclaredVariables to get the variable with all its references
				// across all scopes (including nested function components)
				const declaredVariables = getSourceCode(context).scopeManager?.getDeclaredVariables(node);
				const variable = declaredVariables?.find((v) => v.name === variableName);

				if (!variable) {
					return;
				}

				// Track which properties are defined
				const definedProperties = new Set<string>();
				cssMapArg.properties.forEach((prop) => {
					if (prop.type === 'Property') {
						const keyName = getPropertyKeyName(prop);
						if (keyName) {
							definedProperties.add(keyName);
						}
					}
				});

				// Track which properties are used
				const usedProperties = new Set<string>();
				let hasNonPropertyAccess = false;

				variable.references.forEach((reference) => {
					// Skip the declaration itself
					if (reference.init) {
						return;
					}

					const identifier = reference.identifier as ESTree.Identifier & Rule.NodeParentExtension;
					const parent = identifier.parent;

					// Check if it's a member access (e.g., styles.root)
					if (parent && parent.type === 'MemberExpression' && parent.object === identifier) {
						// Check if it's computed (dynamic) property access like styles[dynamicKey]
						if (parent.computed) {
							// Dynamic access - we can't determine which properties are used
							hasNonPropertyAccess = true;
							return;
						}

						// Static property access
						if (parent.property.type === 'Identifier') {
							usedProperties.add(parent.property.name);
						} else if (
							parent.property.type === 'Literal' &&
							typeof parent.property.value === 'string'
						) {
							usedProperties.add(parent.property.value);
						}
					} else {
						// The cssMap object is used as a whole (e.g., spread, passed to function, etc.)
						// In this case, we can't determine which properties are used, so mark all as used
						hasNonPropertyAccess = true;
					}
				});

				// If the object is used as a whole (not just property access), skip checks
				if (hasNonPropertyAccess) {
					return;
				}

				// Report unused properties
				cssMapArg.properties.forEach((prop) => {
					if (prop.type === 'Property') {
						const keyName = getPropertyKeyName(prop);
						if (keyName && !usedProperties.has(keyName)) {
							context.report({
								node: prop.key,
								messageId: 'unused-property',
								data: {
									propertyName: keyName,
								},
							});
						}
					}
				});
			},
		};
	},
});

export default rule;
