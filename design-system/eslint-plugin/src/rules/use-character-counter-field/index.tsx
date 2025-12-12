import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { JSXElementHelper } from '../../ast-nodes/jsx-element';
import { createLintRule } from '../utils/create-rule';

const TEXTFIELD_PACKAGE = '@atlaskit/textfield';
const TEXTAREA_PACKAGE = '@atlaskit/textarea';
const FORM_PACKAGE = '@atlaskit/form';

export const message =
	'When using `maxLength` or `minLength` props with Textfield/Textarea inside a Form, use `CharacterCounterField` from `@atlaskit/form` instead of Field and remove the props from the Textfield/Textarea. This ensures accessibility through real time feedback and aligns with the design system. Read more about [character counter fields](https://atlassian.design/components/form/examples#character-counter-field)';

export const ruleName = __dirname.split('/').slice(-1)[0];

/**
 * Check if a node is inside a Form component or Field component
 */
function isInsideFormOrField(node: Rule.Node, formComponentNames: Set<string>): boolean {
	let current = node;

	// Traverse up the AST to find parent JSX elements
	while (current) {
		const parent = current.parent;

		if (!parent) {
			break;
		}

		// Check if parent is a JSXElement with a name we're tracking
		if (
			isNodeOfType(parent, 'JSXElement') &&
			isNodeOfType(parent.openingElement.name, 'JSXIdentifier')
		) {
			const parentName = parent.openingElement.name.name;

			// Check if this is a Form component or Field component
			if (formComponentNames.has(parentName)) {
				return true;
			}
		}

		// Check if parent is inside a JSXExpressionContainer (render prop pattern)
		// This handles: <Field>{({ fieldProps }) => <Textfield {...fieldProps} />}</Field>
		if (isNodeOfType(parent, 'JSXExpressionContainer')) {
			// Continue traversing up to find the Field/Form
			current = parent;
			continue;
		}

		// Check if parent is an arrow function (render prop)
		if (isNodeOfType(parent, 'ArrowFunctionExpression')) {
			current = parent;
			continue;
		}

		current = parent;
	}

	return false;
}

const rule = createLintRule({
	meta: {
		name: ruleName,
		type: 'suggestion',
		docs: {
			description:
				'Suggests using CharacterCounterField when Textfield or Textarea components have maxLength or minLength props within a Form.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			useCharacterCounterField: message,
		},
	},

	create(context: Rule.RuleContext) {
		// Track imported component names
		const importedComponents: Map<string, { localName: string; package: string }> = new Map();
		const formComponentNames: Set<string> = new Set();

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				if (typeof source !== 'string') {
					return;
				}

				// Track Form package imports (Form, Field, etc.)
				if (source === FORM_PACKAGE) {
					node.specifiers.forEach((spec) => {
						if (isNodeOfType(spec, 'ImportDefaultSpecifier')) {
							// Default import: import Form from '@atlaskit/form'
							formComponentNames.add(spec.local.name);
						} else if (isNodeOfType(spec, 'ImportSpecifier')) {
							// Named import: import { Form, Field } from '@atlaskit/form'
							formComponentNames.add(spec.local.name);
						}
					});
					return;
				}

				// Track Textfield and Textarea imports
				if (source === TEXTFIELD_PACKAGE || source === TEXTAREA_PACKAGE) {
					const defaultImport = node.specifiers.find((spec) =>
						isNodeOfType(spec, 'ImportDefaultSpecifier'),
					);

					if (defaultImport && isNodeOfType(defaultImport, 'ImportDefaultSpecifier')) {
						const localName = defaultImport.local.name;
						importedComponents.set(localName, {
							localName,
							package: source,
						});
					}
				}
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const elementName = node.openingElement.name.name;

				// Check if this element is one of our tracked components
				const componentInfo = importedComponents.get(elementName);
				if (!componentInfo) {
					return;
				}

				// Check if the component has maxLength or minLength props
				const hasMaxLength = JSXElementHelper.getAttributeByName(node, 'maxLength');
				const hasMinLength = JSXElementHelper.getAttributeByName(node, 'minLength');

				if (hasMaxLength || hasMinLength) {
					// Only warn if inside a Form or Field component
					if (isInsideFormOrField(node, formComponentNames)) {
						context.report({
							node,
							messageId: 'useCharacterCounterField',
						});
					}
				}
			},
		};
	},
});

export default rule;
