import type { Rule } from 'eslint';
import { type Identifier, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const FORM_PACKAGE = '@atlaskit/form';
const MESSAGE_COMPONENTS = ['ErrorMessage', 'HelperMessage', 'ValidMessage'];

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-field-message-wrapper',
		type: 'suggestion',
		hasSuggestions: true,
		docs: {
			description: 'Encourage use of message wrapper component when using form message components.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			useMessageWrapper: `All ADS form messaging components within a field should be wrapped by the \`MessageWrapper\` component from the form package. Consider also using the [simplified field implementation](https://atlassian.design/components/form/examples#simple-implementation-1) to handle styling and accessible messaging directly.`,
		},
	},
	create(context) {
		let fieldImport: Identifier;
		let messageWrapperImport: Identifier;
		let messageImports: Identifier[] = [];

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				// Ignore anomalies
				if (typeof source !== 'string') {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				// If it's not from our package, ignore.
				if (source !== FORM_PACKAGE) {
					return;
				}

				const namedImportSpecifiers = node.specifiers.filter((spec) =>
					isNodeOfType(spec, 'ImportSpecifier'),
				);
				namedImportSpecifiers.forEach((spec) => {
					if (spec.type === 'ImportSpecifier' && 'name' in spec.imported) {
						const name = spec.imported.name;
						const local = spec.local;
						if (MESSAGE_COMPONENTS.includes(name)) {
							messageImports.push(local);
						} else if (name === 'Field') {
							fieldImport = local;
						} else if (name === 'MessageWrapper') {
							messageWrapperImport = local;
						}
					}
				});
			},
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				// if it's not a message component, skip
				if (messageImports.length === 0 || !messageImports.find((imp) => imp.name === name)) {
					return;
				}

				// if no field import exists, skip. It needs to be within our field
				if (!fieldImport) {
					return;
				}

				// If no message wrapper import exists, then it's definitely an error
				if (!messageWrapperImport) {
					return context.report({
						node: node,
						messageId: 'useMessageWrapper',
					});
				}

				// check for if field and message wrapper are parents
				let _node: any = node;
				let hasParentField = false;
				let hasParentMessageWrapper = false;
				while (
					isNodeOfType(_node, 'JSXElement') &&
					isNodeOfType(_node.openingElement.name, 'JSXIdentifier') &&
					!hasParentField
				) {
					const name = _node.openingElement.name.name;
					hasParentField = hasParentField || name === fieldImport.name;
					hasParentMessageWrapper = hasParentMessageWrapper || name === messageWrapperImport.name;
					_node = _node.parent;
					// Skip up until a JSXElement is reached
					if (
						isNodeOfType(_node, 'JSXFragment') ||
						isNodeOfType(_node, 'ArrowFunctionExpression') ||
						isNodeOfType(_node, 'JSXExpressionContainer')
					) {
						while (_node && !isNodeOfType(_node, 'JSXElement') && !isNodeOfType(_node, 'Program')) {
							_node = _node.parent;
						}
					}
				}

				// if not field, skip because this doesn't matter
				if (!hasParentField) {
					return;
				}

				// if it has a message wrapper, skip
				if (hasParentMessageWrapper) {
					return;
				}

				context.report({
					node: node,
					messageId: 'useMessageWrapper',
				});
			},
		};
	},
});

export default rule;
