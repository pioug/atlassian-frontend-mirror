/* eslint-disable @repo/internal/react/require-jsdoc */
import type { Rule } from 'eslint';
import {
	type ImportDeclaration,
	type ImportDefaultSpecifier,
	type ImportNamespaceSpecifier,
	type ImportSpecifier,
	insertImportSpecifier,
	isNodeOfType,
} from 'eslint-codemod-utils';

export const Import = {
	/**
	 * Note: fixes can't overlap, which means this will fail:
	 * ```
	 * const importNode = Root.findImportByModule('@atlaskit/primitives')
	 * Import.insertNamedSpecifier(importNode, 'Box')
	 * Import.insertNamedSpecifier(importNode, 'xcss')
	 * ```
	 *
	 * For this reason `insertNamedSpecifiers` accepts a `specifiers` array, so you can group all inserts together.
	 */
	insertNamedSpecifiers(
		node: ImportDeclaration,
		specifiers: string[],
		fixer: Rule.RuleFixer,
	): Rule.Fix | undefined {
		/**
		 * `insertImportSpecifier()` has the unfortunate implementation detail of naively adding duplicate specifiers.
		 * e.g. calling
		 *  `insertImportSpecifier(importDecl, 'xcss')`
		 * on
		 * `import { Inline, xcss } from '@atlaskit/primitives'`
		 * will result in:
		 * `import { Inline, xcss, xcss } from '@atlaskit/primitives'`.
		 * So, we need to filter out specifiers that are already imported.
		 */
		const uniqueSpecifiers = specifiers.filter((specifier: string) => {
			return !this.containsNamedSpecifier(node, specifier);
		});

		if (uniqueSpecifiers.length === 0) {
			return;
		}

		return fixer.replaceText(
			node,
			`${insertImportSpecifier(node, uniqueSpecifiers.join(', '))};\n`,
		);
	},

	containsNamedSpecifier(node: ImportDeclaration, name: string): boolean {
		return node.specifiers.some(
			(specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier) => {
				if (!isNodeOfType(specifier, 'ImportSpecifier')) {
					return false;
				}

				return specifier.imported.name === name;
			},
		);
	},
};
