import type * as ESTree from 'eslint-codemod-utils';

import { createLintRule } from '../utils/create-rule';

const restrictedFileTypes = ['.css', '.less', '.sass', '.scss'];

const restrictedImports = {
	'@emotion/core': ['Global'],
	'@emotion/react': ['Global'],
	'styled-components': ['createGlobalStyle', 'injectGlobal'],
};

type RestrictedImportSource = keyof typeof restrictedImports;
function isRestrictedImportSource(importSource: string): importSource is RestrictedImportSource {
	return importSource in restrictedImports;
}

export const rule = createLintRule({
	meta: {
		name: 'no-global-styles',
		docs: {
			description: 'Prevents global styles through CSS-in-JS or CSS module imports',
			recommended: true,
			severity: 'warn',
		},
		messages: {
			'no-global-styles': 'Global styles are not allowed.',
			'no-css-modules': 'Importing CSS files is not allowed.',
		},
		type: 'problem',
	},
	create(context) {
		function checkFileType(node: ESTree.ImportDeclaration) {
			const importSource = node.source.value as string;
			if (restrictedFileTypes.some((suffix) => importSource.endsWith(suffix))) {
				context.report({
					node: node.source,
					messageId: 'no-css-modules',
				});
			}
		}

		function checkImports(node: ESTree.ImportDeclaration) {
			const importSource = node.source.value as string;
			if (!isRestrictedImportSource(importSource)) {
				return;
			}

			for (const importName of restrictedImports[importSource]) {
				const specifier = node.specifiers
					.filter(isImportSpecifier)
					.find((specifier) => specifier.imported.name === importName);

				if (specifier) {
					context.report({
						node: specifier,
						messageId: 'no-global-styles',
					});
				}
			}
		}

		return {
			ImportDeclaration(node: ESTree.ImportDeclaration) {
				checkFileType(node);
				checkImports(node);
			},
			'JSXOpeningElement[name.name="style"]'(node: ESTree.Node) {
				context.report({
					node,
					messageId: 'no-global-styles',
				});
			},
		};
	},
});

export default rule;

function isImportSpecifier(node: ESTree.Node): node is ESTree.ImportSpecifier {
	return node.type === 'ImportSpecifier';
}
