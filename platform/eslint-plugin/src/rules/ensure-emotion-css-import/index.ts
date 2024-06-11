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
			description: 'Ensure `css` is always imported when using the css prop from `@emotion/react`.',
			recommended: true,
		},
		messages: {
			noEmotionCssImport: 'Must import `css` from `@emotion/react` when using the `css` prop.',
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
				if (
					name.name === 'css' &&
					value.type === 'JSXExpressionContainer' &&
					value.expression.type === 'ObjectExpression'
				) {
					cssPropExpressonUsed = true;
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
