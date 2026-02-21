import { isNodeOfType } from 'eslint-codemod-utils';

import * as ast from '../../ast-nodes';
import { createLintRule } from '../utils/create-rule';

export const AFFECTED_HTML_ELEMENTS: string[] = ['input', 'textarea'];
export const AFFECTED_ATLASKIT_PACKAGES: Record<string, string[]> = {
	'@atlaskit/datetime-picker': ['DatePicker', 'TimePicker', 'DateTimePicker'],
	'@atlaskit/select': [
		'default',
		'AsyncCreatableSelect',
		'CheckboxSelect',
		'CountrySelect',
		'CreatableSelect',
		'PopupSelect',
		'RadioSelect',
	],
	'@atlaskit/textarea': ['default'],
	'@atlaskit/textfield': ['default'],
};
export const ATLASKIT_FORM_PACKAGE = '@atlaskit/form';
export const ATLASKIT_FIELD_IMPORT = 'Field';

const rule: import('eslint').Rule.RuleModule = createLintRule({
	meta: {
		name: 'no-placeholder',
		type: 'problem',
		docs: {
			description:
				'Placeholders should not be used. If information should be given to the user about the proper type or formatting of a value, this should be included using a helper message that is associated to the input instead.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			noPlaceholder:
				'Placeholders should not be used. Use separate information to help users associated using `aria-describedby` instead.',
			noPlaceholderOnSimpleField:
				'Placeholders should not be used. Use the `helperMessage` prop instead.',
			noPlaceholderOnComplexField:
				'Placeholders should not be used. Use the `HelperMessage` component instead.',
		},
	},

	create(context) {
		let hasFieldImport: boolean = false;
		let fieldLocalName: string | null = null;
		const localComponentNames: string[] = [];

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				if (typeof source !== 'string') {
					return;
				}

				// Ignore non-atlaskit input/form packages
				if (
					!Object.keys(AFFECTED_ATLASKIT_PACKAGES).includes(source) &&
					ATLASKIT_FORM_PACKAGE !== source
				) {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				const defaultImport = node.specifiers.filter(
					(spec) => spec.type === 'ImportDefaultSpecifier',
				);
				const namedImport = node.specifiers.filter((spec) => spec.type === 'ImportSpecifier');

				if (source === ATLASKIT_FORM_PACKAGE) {
					if (
						namedImport.length &&
						namedImport[0].type === 'ImportSpecifier' &&
						'name' in namedImport[0].imported &&
						namedImport[0].imported.name === ATLASKIT_FIELD_IMPORT
					) {
						hasFieldImport = true;
						fieldLocalName = namedImport[0].local.name;
					}
				} else {
					const importNames = AFFECTED_ATLASKIT_PACKAGES[source];
					const usesDefaultImport = importNames.includes('default');
					const possibleNamedImports = importNames.filter((importName) => importName !== 'default');

					if (usesDefaultImport && defaultImport.length && defaultImport[0].local) {
						localComponentNames.push(defaultImport[0].local.name);
						// or if popup and using a named import
					} else if (possibleNamedImports.length >= 1 && namedImport.length) {
						namedImport.forEach((imp) => {
							if (
								imp.type === 'ImportSpecifier' &&
								'name' in imp.imported &&
								possibleNamedImports.includes(imp.imported.name)
							) {
								localComponentNames.push(imp.local.name);
							}
						});
					}
				}
			},
			JSXElement(node: any) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return false;
				}

				const elName = ast.JSXElement.getName(node);
				if (!elName) {
					return false;
				}

				// If it is one of the affected native HTML elements
				if (AFFECTED_HTML_ELEMENTS.includes(elName)) {
					// if has a placeholder attribute
					const hasPlaceholderAttribute = node.openingElement.attributes.find(
						(attr) => isNodeOfType(attr, 'JSXAttribute') && attr.name.name === 'placeholder',
					);

					if (hasPlaceholderAttribute) {
						return context.report({
							node: node.openingElement,
							messageId: 'noPlaceholder',
						});
					}
					// Else, it is a React component
				} else {
					// if none of the affected packages is imported, return
					if (localComponentNames.length === 0) {
						return;
					}
					// if component name is not in the list, exit
					if (
						!isNodeOfType(node.openingElement.name, 'JSXIdentifier') ||
						!localComponentNames.includes(node.openingElement.name.name)
					) {
						return;
					}

					if (hasFieldImport && fieldLocalName) {
						let _node: any = node;
						let hasParentField = false;
						let fieldType = 'Complex';
						// If node is a Field element or if
						while (
							isNodeOfType(_node, 'JSXElement') &&
							isNodeOfType(_node.openingElement.name, 'JSXIdentifier') &&
							!hasParentField
						) {
							const name = _node.openingElement.name.name;
							hasParentField = hasParentField || name === fieldLocalName;
							_node = _node.parent;
							// Skip up until a JSXElement or JSXAttribute is reached
							if (
								isNodeOfType(_node, 'JSXFragment') ||
								isNodeOfType(_node, 'ArrowFunctionExpression') ||
								isNodeOfType(_node, 'JSXExpressionContainer') ||
								isNodeOfType(_node, 'JSXAttribute')
							) {
								while (
									_node &&
									!isNodeOfType(_node, 'JSXElement') &&
									!isNodeOfType(_node, 'Program')
								) {
									if (isNodeOfType(_node, 'JSXAttribute')) {
										fieldType = 'Simple';
									}
									_node = _node.parent;
								}
							}
						}
						if (hasParentField) {
							// if has a placeholder attribute
							const hasPlaceholderAttribute = node.openingElement.attributes.find(
								(attr) => isNodeOfType(attr, 'JSXAttribute') && attr.name.name === 'placeholder',
							);

							if (hasPlaceholderAttribute) {
								return context.report({
									node: node.openingElement,
									messageId: `noPlaceholderOn${fieldType}Field`,
								});
							}
						}
					} else {
						// if has a placeholder attribute
						const hasPlaceholderAttribute = node.openingElement.attributes.find(
							(attr) => isNodeOfType(attr, 'JSXAttribute') && attr.name.name === 'placeholder',
						);

						if (hasPlaceholderAttribute) {
							return context.report({
								node: node.openingElement,
								messageId: 'noPlaceholder',
							});
						}
					}
				}
			},
		};
	},
});

export default rule;
