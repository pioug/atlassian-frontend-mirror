// eslint-disable-next-line import/no-extraneous-dependencies
import type { Rule } from 'eslint';

type Position = {
	line: number;
	column: number;
};

const rule: Rule.RuleModule = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure valid use of the `css` prop from `@emotion/react`',
			recommended: true,
		},
		messages: {
			noEmotionCssImport: 'Must import `css` from `@emotion/react` when using the `css` prop.',
			noEmotionCssPropFunctionCall:
				'No function calls allowed when passing an object directly to the `css` prop with `@emotion/react`.',
		},
	},
	create(context) {
		let emotionJsxImported = false;
		let emotionJsxImportPosition: Position | null | undefined;
		let emotionCssImported = false;
		let cssPropExpressonUsed = false;

		// Ignore files in these directories
		if (/example|__tests__|__fixtures__/.test(context.filename)) {
			return {};
		}

		return {
			ImportDeclaration(node) {
				if (node.source.value === '@emotion/react') {
					node.specifiers.forEach((specifier) => {
						if (specifier.type === 'ImportSpecifier') {
							if (specifier.imported.name === 'jsx') {
								emotionJsxImported = true;
								emotionJsxImportPosition = specifier.loc?.start;
							}
							if (specifier.imported.name === 'css') {
								emotionCssImported = true;
							}
						}
					});
				}
			},
			JSXAttribute(node: any) {
				const { name, value } = node;

				// Only run on emotion css props
				if (!emotionJsxImported) return;
				if (name.name !== 'css') return;

				if (
					value.type === 'JSXExpressionContainer' &&
					value.expression.type === 'ObjectExpression'
				) {
					cssPropExpressonUsed = true;
					let containsFunctionExpression = false;

					// Iterate over the properties of the object
					value.expression.properties.forEach((prop: any) => {
						// Check for function expressions directly within the object literal
						if (
							prop.value?.type === 'ArrowFunctionExpression' ||
							prop.value?.type === 'FunctionExpression' ||
							prop.value?.type === 'CallExpression'
						) {
							containsFunctionExpression = true;
						}
					});

					// If a function expression is found within the direct object literal, report an error
					if (containsFunctionExpression) {
						context.report({
							node,
							messageId: 'noEmotionCssPropFunctionCall',
						});
					}
				}
			},
			'Program:exit'() {
				if (emotionJsxImported && cssPropExpressonUsed && !emotionCssImported) {
					context.report({
						messageId: 'noEmotionCssImport',
						loc: emotionJsxImportPosition || { line: 1, column: 0 },
					});
				}
			},
		};
	},
};

export default rule;
