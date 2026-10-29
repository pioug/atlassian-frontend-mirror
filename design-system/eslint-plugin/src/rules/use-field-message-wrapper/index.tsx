import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { getFormImportLocalNames } from '../utils/get-form-import-local-names';

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
			useMessageWrapper:
				"Import MessageWrapper from @atlaskit/form and wrap the field's HelperMessage, ErrorMessage and ValidMessage elements in it; preserve their ids and the input's aria-describedby associations. For the component prop API, see https://atlassian.design/components/form/examples#simple-implementation-1.",
		},
	},
	create(context) {
		let fieldImport: string;
		let messageWrapperImport: string;
		let messageImports: string[] = [];

		return {
			ImportDeclaration(node) {
				const formImports = getFormImportLocalNames(node);
				fieldImport = formImports.Field?.[0] ?? fieldImport;
				messageWrapperImport = formImports.MessageWrapper?.[0] ?? messageWrapperImport;
				messageImports.push(
					...(formImports.ErrorMessage ?? []),
					...(formImports.HelperMessage ?? []),
					...(formImports.ValidMessage ?? []),
				);
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
				if (messageImports.length === 0 || !messageImports.includes(name)) {
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
					hasParentField = hasParentField || name === fieldImport;
					hasParentMessageWrapper = hasParentMessageWrapper || name === messageWrapperImport;
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
