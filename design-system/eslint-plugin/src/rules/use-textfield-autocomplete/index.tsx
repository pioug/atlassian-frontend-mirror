import type { Rule } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

import { JSXAttribute } from '../../ast-nodes/jsx-attribute';
import { JSXElementHelper } from '../../ast-nodes/jsx-element';
import { createLintRule } from '../utils/create-rule';

const TEXTFIELD_PACKAGE = '@atlaskit/textfield';
const TYPE_PROP = 'type';
const AUTOCOMPLETE_PROP = 'autoComplete';

/**
 * Mapping of input types to their corresponding autocomplete values
 * Can be expanded in the future for other input types (tel, url, etc.)
 */
const TYPE_TO_AUTOCOMPLETE: Record<string, string> = {
	email: 'email',
	tel: 'tel',
	url: 'url',
};

export const ruleName: string = __dirname.split('/').slice(-1)[0];

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: ruleName,
		type: 'suggestion',
		fixable: 'code',
		docs: {
			description:
				'Enforce that Textfield components with type="email", "tel", or "url" have an appropriate autocomplete value for WCAG 2.2 SC 1.3.5 compliance (Identify Input Purpose).',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			missingAutocomplete:
				'Textfield with type="email", "tel", or "url" should have an appropriate autocomplete value to comply with WCAG 2.2 SC 1.3.5 (Identify Input Purpose).',
			noAutocompleteOff:
				'Textfield with type="email", "tel", or "url" should not have autocomplete="off". Set it to an appropriate autocomplete value to comply with WCAG 2.2 SC 1.3.5 (Identify Input Purpose).',
		},
	},

	create(context: Rule.RuleContext) {
		// Track locally imported Textfield component names
		const textfieldImportNames: string[] = [];

		return {
			// Track imports from @atlaskit/textfield
			ImportDeclaration(node) {
				if (node.source.value !== TEXTFIELD_PACKAGE) {
					return;
				}

				node.specifiers.forEach((spec) => {
					// Handle: import Textfield from '@atlaskit/textfield'
					if (isNodeOfType(spec, 'ImportDefaultSpecifier')) {
						textfieldImportNames.push(spec.local.name);
					}
					// Handle: import { default as Textfield } from '@atlaskit/textfield' (edge case)
					if (isNodeOfType(spec, 'ImportSpecifier') && spec.imported.name === 'default') {
						textfieldImportNames.push(spec.local.name);
					}
				});
			},

			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}

				// Check if this is a Textfield component
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const componentName = node.openingElement.name.name;
				if (!textfieldImportNames.includes(componentName)) {
					return;
				}

				// Check for type prop
				const typeProp = JSXElementHelper.getAttributeByName(node, TYPE_PROP);
				if (!typeProp) {
					return;
				}

				// Get the type value - only process if it's a static string literal
				const typeValue = JSXAttribute.getValue(typeProp);
				if (!typeValue || typeValue.type !== 'Literal') {
					// Skip dynamic types (e.g., type={inputType})
					return;
				}

				const typeString = String(typeValue.value);
				if (!(typeString in TYPE_TO_AUTOCOMPLETE)) {
					// Skip if type is not one we're checking
					return;
				}

				const expectedAutocomplete = TYPE_TO_AUTOCOMPLETE[typeString];

				// Check for autoComplete prop
				const autoCompleteProp = JSXElementHelper.getAttributeByName(node, AUTOCOMPLETE_PROP);

				if (!autoCompleteProp) {
					// Missing autoComplete entirely
					return context.report({
						node,
						messageId: 'missingAutocomplete',
						fix(fixer) {
							return JSXElementHelper.addAttribute(
								node,
								AUTOCOMPLETE_PROP,
								expectedAutocomplete,
								fixer,
							);
						},
					});
				}

				// Check the autoComplete value
				const autoCompleteValue = JSXAttribute.getValue(autoCompleteProp);

				if (!autoCompleteValue) {
					// Boolean `autoComplete` has no value node — add the prop. `autoComplete=""` also yields no
					// getValue() (shared helper skips falsy literals); we report but do not autofix to avoid
					// inserting a duplicate attribute.
					return context.report({
						node,
						messageId: 'missingAutocomplete',
						fix(fixer) {
							if (!autoCompleteProp.value) {
								return JSXElementHelper.addAttribute(
									node,
									AUTOCOMPLETE_PROP,
									expectedAutocomplete,
									fixer,
								);
							}
							return null;
						},
					});
				}

				// Handle different value types
				if (autoCompleteValue.type === 'Literal') {
					const valueString = String(autoCompleteValue.value);

					// Check for "off"
					if (valueString === 'off') {
						return context.report({
							node,
							messageId: 'noAutocompleteOff',
							fix(fixer) {
								if (autoCompleteProp.value && isNodeOfType(autoCompleteProp.value, 'Literal')) {
									return fixer.replaceText(autoCompleteProp.value, `"${expectedAutocomplete}"`);
								}
								return null;
							},
						});
					}

					// Valid autoComplete value (e.g. "email")
					// If it is an invalid value, it will be caught by the jsx-a11y/autocomplete-valid rule
					return;
				}

				// If it's a dynamic expression (e.g., autoComplete={someVar}), we can't statically analyze it
				// so we allow it
			},
		};
	},
});

export default rule;
