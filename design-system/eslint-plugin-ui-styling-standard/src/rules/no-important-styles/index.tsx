import type { Property } from 'estree';

import { getScope } from '@atlaskit/eslint-utils/context-compat';
import { hasStyleObjectArguments } from '@atlaskit/eslint-utils/is-supported-import';
import { importSources } from '@atlaskit/eslint-utils/schema';

import { createLintRuleWithTypedConfig } from '../utils/create-rule-with-typed-config';

export const rule: import("eslint").Rule.RuleModule = createLintRuleWithTypedConfig({
	meta: {
		name: 'no-important-styles',
		docs: {
			description: 'Disallows important style declarations',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-important-styles':
				'Important style declarations are disallowed. Refactor so the `!important` flag is not needed.',
		},
		type: 'problem',
		schema: {
			type: 'object',
			properties: {
				importSources,
			},
		},
	},
	create(context, { importSources }) {
		return {
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (!hasStyleObjectArguments(node.callee, references, importSources)) {
					return;
				}

				walkProperties(node, (propertyNode) => {
					if (isImportant(propertyNode.value)) {
						context.report({
							node: propertyNode.value,
							messageId: 'no-important-styles',
						});
					}
				});
			},
		};
	},
});

export default rule;

const IMPORTANT_SUFFIX_REGEX = /!\s*important\s*$/;

/**
 * Walk through all Property nodes in the AST tree recursively.
 * This is faster than esquery for this specific use case as it avoids
 * selector compilation and executes a simple depth-first traversal.
 */
function walkProperties(node: any, callback: (prop: Property) => void): void {
	if (node.type === 'Property' && node.value) {
		callback(node);
	}

	// Iterate through object properties
	if (node.arguments?.length) {
		for (const arg of node.arguments) {
			if (arg.type === 'ObjectExpression' && arg.properties) {
				for (const prop of arg.properties) {
					walkObjectProperty(prop, callback);
				}
			}
		}
	}
}

/**
 * Recursively walk object properties to find nested Property nodes.
 */
function walkObjectProperty(node: any, callback: (prop: Property) => void): void {
	if (node.type === 'Property') {
		callback(node);
		// Recursively check nested objects
		if (node.value?.type === 'ObjectExpression' && node.value.properties) {
			for (const prop of node.value.properties) {
				walkObjectProperty(prop, callback);
			}
		}
	}
}

/**
 * Check if a value contains !important flag.
 * Uses fast string checks before regex to avoid regex overhead for common cases.
 */
function isImportant(node: Property['value']): boolean {
	if (node.type === 'Literal') {
		if (typeof node.value !== 'string') {
			return false;
		}
		// Fast check: string must end with 'important' (after optional whitespace)
		const len = node.value.length;
		if (len < 10) {return false;} // "!important" is 10 chars minimum
		return IMPORTANT_SUFFIX_REGEX.test(node.value);
	}

	if (node.type === 'TemplateLiteral') {
		if (!node.quasis?.length) {
			return false;
		}
		// Only check the last quasi's raw value (most likely to contain the !important)
		const lastQuasi = node.quasis[node.quasis.length - 1];
		return IMPORTANT_SUFFIX_REGEX.test(lastQuasi.value.raw);
	}

	return false;
}
