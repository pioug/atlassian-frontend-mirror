import type { AST_NODE_TYPES } from '@typescript-eslint/typescript-estree/dist/ts-estree';
import type { Rule } from 'eslint';
import type * as ESTree from 'eslint-codemod-utils';
import esquery from 'esquery';
import estraverse from 'estraverse';
import type { JSONSchema4 } from 'json-schema';

import {
	type AllowList,
	getAllowedDynamicKeys,
	getAllowedFunctionCalls,
	isAllowListedVariable,
} from '@atlaskit/eslint-utils/allowed-function-calls';
import { getScope, getSourceCode } from '@atlaskit/eslint-utils/context-compat';
import { findVariable } from '@atlaskit/eslint-utils/find-variable';
import {
	getImportSources,
	hasStyleObjectArguments,
	isCxFunction,
} from '@atlaskit/eslint-utils/is-supported-import';

import { createLintRule } from '../utils/create-rule';

const schema: JSONSchema4 = [
	{
		type: 'object',
		properties: {
			importSources: {
				type: 'array',
				items: { type: 'string' },
				uniqueItems: true,
			},
			allowedFunctionCalls: {
				type: 'array',
				items: {
					type: 'array',
					minItems: 2,
					maxItems: 2,
					items: [{ type: 'string' }, { type: 'string' }],
				},
				uniqueItems: true,
			},
			allowedDynamicKeys: {
				type: 'array',
				items: {
					type: 'array',
					minItems: 2,
					maxItems: 2,
					items: [{ type: 'string' }, { type: 'string' }],
				},
				uniqueItems: true,
			},
		},
	},
];

const isIdentifierImported = (
	identifier: ESTree.Identifier,
	context: Rule.RuleContext,
	functionAllowList: AllowList,
	keysAllowList: AllowList,
): boolean => {
	const variable = findVariable({
		identifier: identifier,
		sourceCode: getSourceCode(context),
	});
	if (!variable) {
		return false;
	}

	const isImported = variable.defs.some((definition) => definition.type === 'ImportBinding');

	// check if imported variable is allowed
	return (
		isImported &&
		!isAllowListedVariable({
			allowList: functionAllowList,
			variable,
		}) &&
		!isAllowListedVariable({ allowList: keysAllowList, variable })
	);
};

const checkIdentifier = (
	identifier: ESTree.Identifier,
	context: Rule.RuleContext,
	functionAllowList: AllowList,
	keysAllowList: AllowList,
) => {
	const { parent } = identifier as Rule.Node;

	// Even though `member` in `object.member` is syntactically an identifier,
	// it should be ignored as `.member` is syntax sugar for `['member']` here.
	// We should still lint `object[member]` (when `parent.computed` === true)
	if (parent.type === 'MemberExpression' && identifier === parent.property && !parent.computed) {
		return;
	}

	// Even though `key` in `{ key: 'value' }` is syntactically an identifier,
	// it should be ignored as `key` is syntax sugar for `'key'` here.
	// We should still lint `[key]` (when `parent.computed` === true)
	if (parent && parent.type === 'Property' && identifier === parent.key && !parent.computed) {
		return;
	}

	if (isIdentifierImported(identifier, context, functionAllowList, keysAllowList)) {
		context.report({
			node: identifier,
			messageId: 'no-imported-style-values',
		});
	}
};

export const rule = createLintRule({
	meta: {
		name: 'no-imported-style-values',
		docs: {
			description: 'Disallows imports of style values',
			recommended: true,
			severity: 'error',
		},
		messages: {
			'no-imported-style-values':
				'Styles should not be imported to use in css, cssMap, styled, keyframes or xcss calls. All styles should be defined and used in the same file instead.',
		},
		type: 'problem',
		schema,
	},
	create(context) {
		const importSources = getImportSources(context);
		const functionAllowList = getAllowedFunctionCalls(context.options);
		const keysAllowList = getAllowedDynamicKeys(context.options);

		const checkForIdentifiers = (node: ESTree.Node) => {
			const matches = esquery(node, 'Identifier');

			for (const match of matches) {
				if (match.type === 'Identifier') {
					checkIdentifier(match, context, functionAllowList, keysAllowList);
				}
			}
		};

		const isValidCx = (jsxAttribute: ESTree.JSXAttribute, identifier: ESTree.Identifier) => {
			/**
			 * We don't want to allow `cx` for `css` (or `style`)
			 */
			if (jsxAttribute.name.name !== 'xcss') {
				return false;
			}

			/**
			 * Check we have the exact form of `xcss={cx(...)}` otherwise it isn't valid.
			 */

			const jsxExpression = jsxAttribute.value;
			if (jsxExpression?.type !== 'JSXExpressionContainer') {
				return false;
			}

			const callExpression = jsxExpression.expression;
			if (callExpression?.type !== 'CallExpression') {
				return false;
			}

			if (callExpression.callee !== identifier) {
				return false;
			}

			return isCxFunction(identifier, getScope(context, identifier).references, importSources);
		};

		return {
			// Checking css/cssMap/keyframes/styled/xcss calls
			CallExpression(node) {
				const { references } = getScope(context, node);

				if (!hasStyleObjectArguments(node.callee, references, importSources)) {
					return;
				}
				node.arguments.forEach(checkForIdentifiers);
			},
			'JSXAttribute[name.name=/^(style|css|xcss)$/]'(jsxAttribute: ESTree.Node) {
				if (jsxAttribute.type !== 'JSXAttribute') {
					return;
				}

				estraverse.traverse(jsxAttribute, {
					fallback(node) {
						// estraverse does not know about nodes not in the ESTree standard.
						// This includes JSX nodes, so we must provide a fallback method to handle them.
						// Using `fallback: 'iteration'` can cause cycles because it will iterate
						// over the `parent` attribute on JSX nodes.
						return Object.keys(node).filter((key) => key !== 'parent');
					},
					enter(node, parent) {
						// Ignore type contexts
						// Cast required because ESTree is not aware of TypeScript nodes
						if ((node.type as AST_NODE_TYPES) === 'TSTypeReference') {
							return estraverse.VisitorOption.Skip;
						}

						// Ignore conditions of ternary expressions
						if (parent?.type === 'ConditionalExpression' && node === parent.test) {
							return estraverse.VisitorOption.Skip;
						}

						// Ignore LHS of logical expressions (&&, ||)
						if (parent?.type === 'LogicalExpression' && node === parent.left) {
							return estraverse.VisitorOption.Skip;
						}

						if (node.type !== 'Identifier') {
							return;
						}

						if (isValidCx(jsxAttribute, node)) {
							return;
						}

						checkIdentifier(node, context, functionAllowList, keysAllowList);
					},
				});
			},
		};
	},
});

export default rule;
