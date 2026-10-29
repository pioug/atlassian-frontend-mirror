import type { Rule } from 'eslint';
import { type Identifier, type ImportDeclaration, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-lint-rule';
import { FORM_PACKAGE, getFormImportLocalNames } from '../utils/get-form-import-local-names';
import { isImportFromPackage } from '../utils/is-import-from-package';

export const useCheckboxFieldMessage = 'Convert Field to CheckboxField';
export const useRangeFieldMessage = 'Convert Field to RangeField';

const rule: Rule.RuleModule = createLintRule({
	meta: {
		name: 'use-correct-field',
		type: 'suggestion',
		fixable: 'code',
		hasSuggestions: true,
		docs: {
			description:
				'Ensure makers use appropriate field component for their respective form elements.',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			useCheckboxField:
				'Replace this Field with CheckboxField from @atlaskit/form, keeping its name, validation and render-prop wiring for the Checkbox. Apply the offered conversion suggestion when available.',
			useRangeField:
				'Replace this Field with RangeField from @atlaskit/form, keeping its name, validation and render-prop wiring for the Range. Apply the offered conversion suggestion when available.',
			useCheckboxFieldForToggle:
				'Wrap this Toggle in CheckboxField from @atlaskit/form instead of Field, preserving its name, validation and render-prop wiring. Apply the offered conversion suggestion when available.',
		},
	},
	create(context) {
		const specialFieldsByImport: Record<string, Record<string, string | undefined>> = {
			'@atlaskit/checkbox': { component: 'Checkbox', field: 'CheckboxField', local: undefined },
			'@atlaskit/range': { component: 'Range', field: 'RangeField', local: undefined },
			'@atlaskit/toggle': { component: 'Toggle', field: 'CheckboxField', local: undefined },
		};

		const specialFieldPackages = Object.keys(specialFieldsByImport);

		let fieldImport: Identifier;
		let fieldImportSource: string | undefined;
		const allPackages: ImportDeclaration[] = [];

		return {
			ImportDeclaration(node) {
				const source = node.source.value;

				if (typeof source !== 'string') {
					return;
				}

				if (!node.specifiers.length) {
					return;
				}

				const defaultImport = node.specifiers.filter((spec) =>
					isNodeOfType(spec, 'ImportDefaultSpecifier'),
				);

				const matchedSpecialFieldPackage = specialFieldPackages.find((packageName) =>
					isImportFromPackage(source, packageName),
				);
				if (matchedSpecialFieldPackage) {
					allPackages.push(node);
					// set local to local value
					if (
						defaultImport.length &&
						isNodeOfType(defaultImport[0], 'ImportDefaultSpecifier') &&
						isNodeOfType(defaultImport[0].local, 'Identifier')
					) {
						specialFieldsByImport[matchedSpecialFieldPackage].local = defaultImport[0].local.name;
					}
				}

				const formImports = getFormImportLocalNames(node);
				if (!formImports.Field?.length) {
					return;
				}
				fieldImportSource = source;
				const matchingSpecifier = node.specifiers.find((spec) => {
					if (
						source === FORM_PACKAGE &&
						isNodeOfType(spec, 'ImportSpecifier') &&
						'name' in spec.imported &&
						spec.imported.name === 'Field'
					) {
						return true;
					}

					return (
						isNodeOfType(spec, 'ImportDefaultSpecifier') &&
						spec.local.name === formImports.Field?.[0]
					);
				});
				if (matchingSpecifier?.local) {
					fieldImport = matchingSpecifier.local;
				}
			},
			JSXElement(node: Rule.Node) {
				if (!isNodeOfType(node, 'JSXElement')) {
					return;
				}
				if (!isNodeOfType(node.openingElement.name, 'JSXIdentifier')) {
					return;
				}

				const name = node.openingElement.name.name;

				// if it's not a field import, skip
				if (!fieldImport || name !== fieldImport.name) {
					return;
				}

				// If no special field packages were imported, exit early.
				if (!allPackages.length) {
					return;
				}

				const fieldRenderProp = node.children.find((c) =>
					isNodeOfType(c, 'JSXExpressionContainer'),
				);
				if (!fieldRenderProp) {
					return;
				}
				// I'm not early exiting because it doesn't work with ts for some reason
				if (isNodeOfType(fieldRenderProp, 'JSXExpressionContainer')) {
					if (!isNodeOfType(fieldRenderProp.expression, 'ArrowFunctionExpression')) {
						return;
					}

					const q: any[] = [fieldRenderProp.expression.body];
					let found;

					while (q.length > 0 && !found) {
						const child = q.pop();
						if ('children' in child) {
							for (const innerChild of child.children) {
								q.push(innerChild);
							}
						} else if (
							isNodeOfType(child, 'BlockStatement') &&
							isNodeOfType(child.body[0], 'ExpressionStatement')
						) {
							q.push(child.body[0].expression);
						}

						if (
							!isNodeOfType(child, 'JSXElement') ||
							!isNodeOfType(child.openingElement.name, 'JSXIdentifier')
						) {
							continue;
						}

						const elementName = child.openingElement.name.name;

						for (const importName in specialFieldsByImport) {
							// if this child is one of the found component names
							// then break out of the while loop and use the found object
							const localName = specialFieldsByImport[importName].local;
							if (localName === elementName) {
								found = specialFieldsByImport[importName].component;
								break;
							}
						}
					}

					if (!found) {
						return;
					}

					// if checkbox is inside of the field's render prop
					if (found === 'Checkbox' || found === 'Toggle') {
						const suggestions =
							fieldImportSource === FORM_PACKAGE
								? [
										{
											desc: useCheckboxFieldMessage,
											fix(fixer: Rule.RuleFixer) {
												const fixes: Rule.Fix[] = [];

												fixes.push(fixer.insertTextBefore(fieldImport, 'CheckboxField, '));
												fixes.push(fixer.replaceText(node.openingElement.name, 'CheckboxField'));
												node.closingElement &&
													fixes.push(fixer.replaceText(node.closingElement.name, 'CheckboxField'));

												return fixes;
											},
										},
									]
								: [];
						context.report({
							node: node,
							messageId: found === 'Checkbox' ? 'useCheckboxField' : 'useCheckboxFieldForToggle',
							...(suggestions.length ? { suggest: suggestions } : {}),
						});
					} else if (found === 'Range') {
						const suggestions =
							fieldImportSource === FORM_PACKAGE
								? [
										{
											desc: useRangeFieldMessage,
											fix(fixer: Rule.RuleFixer) {
												const fixes: Rule.Fix[] = [];

												fixes.push(fixer.insertTextBefore(fieldImport, 'RangeField, '));
												fixes.push(fixer.replaceText(node.openingElement.name, 'RangeField'));
												node.closingElement &&
													fixes.push(fixer.replaceText(node.closingElement.name, 'RangeField'));

												return fixes;
											},
										},
									]
								: [];
						context.report({
							node: node,
							messageId: 'useRangeField',
							...(suggestions.length ? { suggest: suggestions } : {}),
						});
					}
				}
			},
		};
	},
});

export default rule;
