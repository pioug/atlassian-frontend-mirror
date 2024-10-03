/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'eslint-codemod-utils';

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
		if (!isSupportedForLint(node)) {
			return;
		}

		const nodeName = ast.JSXElement.getName(node);
		const sourceCode = context.getSourceCode();
		const importDeclarations = sourceCode.ast.body.filter(isImportDeclaration);

		let existingLinkName = null;
		let existingLinkButtonName = null;
		const usedNames = new Set();

		// Check for existing imports
		for (const declaration of importDeclarations) {
			for (const specifier of declaration.specifiers) {
				usedNames.add(specifier.local.name);
			}

			if (declaration.source.value === '@atlaskit/link') {
				const defaultSpecifier = declaration.specifiers.find(
					(specifier) => specifier.type === 'ImportDefaultSpecifier',
				);
				if (defaultSpecifier) {
					existingLinkName = defaultSpecifier.local.name;
				}
			} else if (declaration.source.value === '@atlaskit/button/new') {
				const namedSpecifier = declaration.specifiers.find(
					(specifier) =>
						specifier.type === 'ImportSpecifier' && specifier.imported.name === 'LinkButton',
				);
				if (namedSpecifier) {
					existingLinkButtonName = namedSpecifier.local.name;
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

		const linkName = existingLinkName || generateUniqueName('Link');
		const linkButtonName = existingLinkButtonName || generateUniqueName('LinkButton');

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlAnchor',
			data: {
				name: nodeName,
			},
			suggest: [
				{
					desc: 'Replace with Link component from @atlaskit/link',
					fix(fixer) {
						const openingTagRange = node.openingElement.range;
						const closingTagRange = node.closingElement?.range;
						const attributesText = node.openingElement.attributes
							.map((attr) => sourceCode.getText(attr))
							.join(' ');

						const fixers = [];

						// Replace <a> with <Link> and retain attributes
						if (openingTagRange) {
							if (node.openingElement.selfClosing) {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${linkName}${attributesText ? ` ${attributesText}` : ''} /`,
									),
								);
							} else {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${linkName}${attributesText ? ` ${attributesText}` : ''}`,
									),
								);
							}
						}
						if (closingTagRange && !node.openingElement.selfClosing) {
							fixers.push(
								fixer.replaceTextRange([closingTagRange[0] + 2, closingTagRange[1] - 1], linkName),
							);
						}

						// Add import if not present
						if (!existingLinkName) {
							const importStatement = `import ${linkName} from '@atlaskit/link';\n`;
							fixers.push(fixer.insertTextBefore(sourceCode.ast, importStatement));
						}

						return fixers;
					},
				},
				{
					desc: 'Replace with LinkButton component from @atlaskit/button/new',
					fix(fixer) {
						const openingTagRange = node.openingElement.range;
						const closingTagRange = node.closingElement?.range;
						const attributesText = node.openingElement.attributes
							.map((attr) => sourceCode.getText(attr))
							.join(' ');

						const fixers = [];

						// Replace <a> with <LinkButton> and retain attributes
						if (openingTagRange) {
							if (node.openingElement.selfClosing) {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${linkButtonName}${attributesText ? ` ${attributesText}` : ''} /`,
									),
								);
							} else {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${linkButtonName}${attributesText ? ` ${attributesText}` : ''}`,
									),
								);
							}
						}
						if (closingTagRange && !node.openingElement.selfClosing) {
							fixers.push(
								fixer.replaceTextRange(
									[closingTagRange[0] + 2, closingTagRange[1] - 1],
									linkButtonName,
								),
							);
						}

						// Add import if not present
						if (!existingLinkButtonName) {
							const importStatement = `import { ${linkButtonName} } from '@atlaskit/button/new';\n`;
							fixers.push(fixer.insertTextBefore(sourceCode.ast, importStatement));
						}

						return fixers;
					},
				},
			],
		});
	},
};
