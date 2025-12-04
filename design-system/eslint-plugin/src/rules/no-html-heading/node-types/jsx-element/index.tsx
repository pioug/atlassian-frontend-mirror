import type { Rule } from 'eslint';
import { type ImportDeclaration, isNodeOfType } from 'eslint-codemod-utils';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import * as ast from '../../../../ast-nodes';
import { isSupportedForLint } from '../supported';

interface MetaData {
	context: Rule.RuleContext;
}

function isImportDeclaration(node: any): node is ImportDeclaration {
	return node.type === 'ImportDeclaration';
}

export const JSXElement = {
	lint(node: Rule.Node, { context }: MetaData) {
		// @ts-ignore - Node type compatibility issue with EslintNode
		if (!isSupportedForLint(node)) {
			return;
		}

		// @ts-ignore - Node type compatibility issue with EslintNode
		const nodeName = ast.JSXElement.getName(node);
		const sourceCode = getSourceCode(context);
		const importDeclarations = sourceCode.ast.body.filter(isImportDeclaration);

		let existingHeadingName = null;
		const usedNames = new Set();

		// Check for existing imports
		for (const declaration of importDeclarations) {
			for (const specifier of declaration.specifiers) {
				usedNames.add(specifier.local.name);
			}

			if (declaration.source.value === '@atlaskit/heading') {
				const defaultSpecifier = declaration.specifiers.find(
					(specifier) => specifier.type === 'ImportDefaultSpecifier',
				);
				if (defaultSpecifier) {
					existingHeadingName = defaultSpecifier.local.name;
				}
			}
		}

		const generateUniqueName = (baseName: string) => {
			let index = 1;
			let newName = baseName;
			while (usedNames.has(newName)) {
				newName = `${baseName}${index}`;
				index++;
			}
			return newName;
		};

		const headingName = existingHeadingName || generateUniqueName('Heading');

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlHeading',
			data: {
				name: nodeName,
			},
			suggest: [
				{
					desc: 'Replace with Heading component from @atlaskit/heading',
					fix(fixer) {
						const openingTagRange = node.openingElement.range;
						const closingTagRange = node.closingElement?.range;
						const elementName = isNodeOfType(node.openingElement.name, 'JSXIdentifier')
							? node.openingElement.name.name
							: '';
						const attributesText = node.openingElement.attributes
							// Don't bring in the "role" or the "aria-level" because it's not needed
							.filter(
								(attr) =>
									!isNodeOfType(attr, 'JSXAttribute') ||
									(typeof attr.name.name === 'string' &&
										!['role', 'aria-level'].includes(attr.name.name)),
							)
							.map((attr) => sourceCode.getText(attr))
							.join(' ');

						// Get the heading level
						let headingLevel = '';
						const ariaLevel = node.openingElement.attributes.find(
							(attr) => isNodeOfType(attr, 'JSXAttribute') && attr.name.name === 'aria-level',
						);
						if (ariaLevel && isNodeOfType(ariaLevel, 'JSXAttribute')) {
							// If it's a string
							if (ariaLevel.value?.type === 'Literal' && ariaLevel.value.value) {
								headingLevel = `h${ariaLevel.value.value}`;
								// If it's a number or some other literal in an expression container
							} else if (
								ariaLevel.value?.type === 'JSXExpressionContainer' &&
								ariaLevel.value.expression.type === 'Literal' &&
								ariaLevel.value.expression.value
							) {
								headingLevel = `h${ariaLevel.value.expression.value}`;
							}
						} else if (elementName.match(/h[1-6]/)) {
							headingLevel = elementName;
						}

						const fixers = [];

						// Replace <a> with <Heading> and retain attributes
						if (openingTagRange) {
							if (node.openingElement.selfClosing) {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${headingName}${headingLevel ? ` as="${headingLevel}"` : ''}${attributesText ? ` ${attributesText}` : ''} /`,
									),
								);
							} else {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${headingName}${headingLevel ? ` as="${headingLevel}"` : ''}${attributesText ? ` ${attributesText}` : ''}`,
									),
								);
							}
						}
						if (closingTagRange && !node.openingElement.selfClosing) {
							fixers.push(
								fixer.replaceTextRange(
									[closingTagRange[0] + 2, closingTagRange[1] - 1],
									headingName,
								),
							);
						}

						// Add import if not present
						if (!existingHeadingName) {
							const importStatement = `import ${headingName} from '@atlaskit/heading';\n`;
							fixers.push(fixer.insertTextBefore(sourceCode.ast, importStatement));
						}

						return fixers;
					},
				},
			],
		});
	},
};
