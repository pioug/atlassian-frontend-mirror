import type { Rule } from 'eslint';
import { type Identifier, type ImportDeclaration, isNodeOfType } from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const specialFieldsByImport: Record<string, Record<string, string | undefined>> = {
	'@atlaskit/checkbox': { component: 'Checkbox', field: 'CheckboxField', local: undefined },
	'@atlaskit/range': { component: 'Range', field: 'RangeField', local: undefined },
	'@atlaskit/toggle': { component: 'Toggle', field: 'CheckboxField', local: undefined },
};

export const useCheckboxFieldMessage = 'Convert Field to CheckboxField';
export const useRangeFieldMessage = 'Convert Field to RangeField';

const rule = createLintRule({
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
			useCheckboxField: 'Checkbox components should use the `CheckboxField` component',
			useRangeField: 'Range components should use the `RangeField` component',
			useCheckboxFieldForToggle: 'Toggle components should use the `CheckboxField` component',
		},
	},
	create(context) {
		let fieldImport: Identifier;
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

				if (source in specialFieldsByImport) {
					allPackages.push(node);
					// set local to local value
					if (
						defaultImport.length &&
						isNodeOfType(defaultImport[0], 'ImportDefaultSpecifier') &&
						isNodeOfType(defaultImport[0].local, 'Identifier')
					) {
						specialFieldsByImport[source].local = defaultImport[0].local.name;
					}
				}

				if ('@atlaskit/form' !== source) {
					return;
				}

				const namedImport = node.specifiers.filter((spec) => isNodeOfType(spec, 'ImportSpecifier'));
				if (
					namedImport.length &&
					namedImport[0].type === 'ImportSpecifier' &&
					namedImport[0].imported.name === 'Field'
				) {
					fieldImport = namedImport[0].local;
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

				// If no imports are for the inputs that have special fields, exit early
				if (
					allPackages.every(
						(n) =>
							typeof n.source.value !== 'string' ||
							!Object.keys(specialFieldsByImport).includes(n.source.value),
					)
				) {
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
						context.report({
							node: node,
							messageId: found === 'Checkbox' ? 'useCheckboxField' : 'useCheckboxFieldForToggle',
							suggest: [
								{
									desc: useCheckboxFieldMessage,
									fix(fixer) {
										const fixes: Rule.Fix[] = [];

										fixes.push(fixer.insertTextBefore(fieldImport, 'CheckboxField, '));
										fixes.push(fixer.replaceText(node.openingElement.name, 'CheckboxField'));
										node.closingElement &&
											fixes.push(fixer.replaceText(node.closingElement.name, 'CheckboxField'));

										return fixes;
									},
								},
							],
						});
					} else if (found === 'Range') {
						context.report({
							node: node,
							messageId: 'useRangeField',
							suggest: [
								{
									desc: useRangeFieldMessage,
									fix(fixer) {
										const fixes: Rule.Fix[] = [];

										fixes.push(fixer.insertTextBefore(fieldImport, 'RangeField, '));
										fixes.push(fixer.replaceText(node.openingElement.name, 'RangeField'));
										node.closingElement &&
											fixes.push(fixer.replaceText(node.closingElement.name, 'RangeField'));

										return fixes;
									},
								},
							],
						});
					}
				}
			},
		};
	},
});

export default rule;
