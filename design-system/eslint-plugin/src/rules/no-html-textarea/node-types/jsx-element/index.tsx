import type { Rule } from 'eslint';
import { type ImportDeclaration } from 'eslint-codemod-utils';

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
	lint(node: Rule.Node, { context }: MetaData): void {
		if (!isSupportedForLint(node)) {
			return;
		}

		const nodeName = ast.JSXElement.getName(node);
		const sourceCode = getSourceCode(context);
		const importDeclarations = sourceCode.ast.body.filter(isImportDeclaration);

		let existingTextareaName: string | null = null;
		const usedNames = new Set();

		// Check for existing imports
		for (const declaration of importDeclarations) {
			for (const specifier of declaration.specifiers) {
				usedNames.add(specifier.local.name);
			}

			if (declaration.source.value === '@atlaskit/textarea') {
				const defaultSpecifier = declaration.specifiers.find(
					(specifier) => specifier.type === 'ImportDefaultSpecifier',
				);
				if (defaultSpecifier) {
					existingTextareaName = defaultSpecifier.local.name;
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

		const textareaName = existingTextareaName || generateUniqueName('Textarea');

		context.report({
			node: node.openingElement,
			messageId: 'noHtmlTextarea',
			data: {
				name: nodeName,
			},
			suggest: [
				{
					desc: 'Replace with Textarea component from @atlaskit/textarea',
					fix(fixer) {
						const openingTagRange = node.openingElement.range;
						const closingTagRange = node.closingElement?.range;
						const attributesText = node.openingElement.attributes
							.map((attr) => sourceCode.getText(attr))
							.join(' ');

						const fixers = [];

						// Replace <textarea> with <Textarea> and retain attributes
						if (openingTagRange) {
							if (node.openingElement.selfClosing) {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${textareaName}${attributesText ? ` ${attributesText}` : ''} /`,
									),
								);
							} else {
								fixers.push(
									fixer.replaceTextRange(
										[openingTagRange[0] + 1, openingTagRange[1] - 1],
										`${textareaName}${attributesText ? ` ${attributesText}` : ''}`,
									),
								);
							}
						}
						if (closingTagRange && !node.openingElement.selfClosing) {
							fixers.push(
								fixer.replaceTextRange(
									[closingTagRange[0] + 2, closingTagRange[1] - 1],
									textareaName,
								),
							);
						}

						// Add import if not present
						if (!existingTextareaName) {
							const importStatement = `import ${textareaName} from '@atlaskit/textarea';\n`;
							fixers.push(fixer.insertTextBefore(sourceCode.ast, importStatement));
						}

						return fixers;
					},
				},
			],
		});
	},
};
