import type { Rule } from 'eslint';
import {
	type Directive,
	type ImportDeclaration,
	isNodeOfType,
	type JSXIdentifier,
	type JSXOpeningElement,
	type ModuleDeclaration,
	type Statement,
} from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { createLintRule } from '../utils/create-rule';
import { getConfig } from '../utils/get-deprecated-config';
import { type DeprecatedConfig, isDeprecatedJSXAttributeConfig } from '../utils/types';

export const noDeprecatedJSXAttributeMessageId = 'noDeprecatedJSXAttributes';

const isImportDeclaration = (
	programStatement: Directive | Statement | ModuleDeclaration,
): programStatement is ImportDeclaration => {
	return programStatement?.type === 'ImportDeclaration';
};

const findJSXElementName = (jsxAttributeNode: Rule.Node): string | undefined => {
	if (!jsxAttributeNode.parent || !isNodeOfType(jsxAttributeNode?.parent, 'JSXOpeningElement')) {
		return;
	}

	const openingElement = jsxAttributeNode.parent as JSXOpeningElement;
	if (!isNodeOfType(openingElement.name, 'JSXIdentifier')) {
		return;
	}

	return (openingElement.name as JSXIdentifier).name;
};

export const name = 'no-deprecated-apis';

const rule = createLintRule({
	meta: {
		name,
		type: 'suggestion',
		docs: {
			description: 'Disallow using deprecated APIs.',
			recommended: true,
			severity: 'error',
		},
		messages: {
			noDeprecatedJSXAttributes: 'The JSX attribute {{propName}} has been deprecated.',
		},
		schema: [
			{
				type: 'object',
				properties: {
					deprecatedConfig: {
						type: 'object',
						properties: {
							'.+': {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										moduleSpecifier: { type: 'string' },
										namedSpecifiers: {
											type: 'array',
											items: { type: 'string' },
										},
										actionableVersion: { type: 'string' },
									},
									required: ['moduleSpecifier'],
									additionalProperties: false,
								},
							},
						},
					},
				},
			},
		],
	},
	create(context) {
		// Get the rule configuration specified otherwise use default config.
		// A bit confusing as it seems that the default options have precedence over the user specified options.
		const deprecatedConfig: DeprecatedConfig =
			context.options[0]?.deprecatedConfig || getConfig('jsxAttributes');

		return {
			// find JSX attribute - find name of attribute - get source and find relevant identifiers.
			JSXAttribute(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXAttribute') || !isNodeOfType(node.name, 'JSXIdentifier')) {
					return;
				}
				const jsxAttributeName = node.name.name;

				if (
					!isDeprecatedJSXAttributeConfig(deprecatedConfig) ||
					!deprecatedConfig[jsxAttributeName]
				) {
					return;
				}

				const jsxElementName = findJSXElementName(node);

				if (!jsxElementName) {
					return;
				}
				const source = getSourceCode(context);

				// find an import for the path of the banned api
				deprecatedConfig[jsxAttributeName].forEach((importItem) => {
					const importNode = source.ast.body
						.filter(isImportDeclaration)
						.find(
							(node) =>
								node &&
								node.source.value &&
								typeof node.source.value === 'string' &&
								node.source.value.includes(importItem.moduleSpecifier),
						);

					if (!importNode) {
						return;
					}

					// find an import that matches our JSX element
					const targetNode = importNode.specifiers.find(
						(node) => node.local.name === jsxElementName,
					);

					// check if the import exists
					if (!targetNode) {
						return;
					}

					// if the import has named specifiers, check if the JSX element is one of them
					if (
						importItem?.namedSpecifiers?.length &&
						!importItem.namedSpecifiers.includes(targetNode.local.name)
					) {
						return;
					}

					// if we're here, there is a valid lint error.
					context.report({
						node,
						messageId: 'noDeprecatedJSXAttributes',
						data: {
							propName: jsxAttributeName,
						},
					});
				});
			},
		};
	},
});

export default rule;
