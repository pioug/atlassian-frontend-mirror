import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { JSXAttribute } from '../../ast-nodes/jsx-attribute';
import { JSXElementHelper } from '../../ast-nodes/jsx-element';
import { createLintRule } from '../utils/create-rule';

const PROP_NAME = 'autoFocus';

// Lint rule message
export const message =
	"`autoFocus` should be set to a component's `ref` or left to resolve to the default value of `true`. It is recommended to leave it as is for a maximally accessible experience.";

export const ruleName = __dirname.split('/').slice(-1)[0];

const rule = createLintRule({
	meta: {
		name: ruleName,
		type: 'problem',
		docs: {
			description:
				"Encourages makers to not use boolean values for `autoFocus` on Atlassian Design System's modal dialog component.",
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noBooleanForAutoFocus: message,
		},
	},

	create(context: Rule.RuleContext) {
		// List of component's locally imported names that match
		let defaultImportLocalName: string;

		return {
			// Only run rule in files where the package is imported
			ImportDeclaration(node) {
				// Ignore non-modal imports
				if (node.source.value !== '@atlaskit/modal-dialog') {
					return;
				}

				node.specifiers
					.filter((identifier) => isNodeOfType(identifier, 'ImportDefaultSpecifier'))
					.forEach((identifier) => {
						defaultImportLocalName = identifier.local.name;
					});
			},

			JSXElement(node: Rule.Node) {
				// @ts-ignore - Node type compatibility issue with EslintNode
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				if (name !== defaultImportLocalName) {
					return;
				}

				const prop = JSXElementHelper.getAttributeByName(node, PROP_NAME);

				// if no autoFocus attribute exists, skip
				if (!prop) {
					return;
				}

				const attrValue = JSXAttribute.getValue(prop);

				if (!attrValue) {
					return;
				}

				const { type, value } = attrValue;

				// If the value is a boolean with value `false`
				if (type === 'ExpressionStatement Literal' && typeof value === 'boolean') {
					return context.report({
						node,
						messageId: 'noBooleanForAutoFocus',
					});
				}
			},
		};
	},
});

export default rule;
