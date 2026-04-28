import type { Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Import } from '../../ast-nodes/import';
import { Root } from '../../ast-nodes/root';

const CSS_IMPORT_MODULE = '@atlaskit/css';

/**
 * Upserts `cssMap` from `@atlaskit/css`, handling:
 * 1. Already imported → no-op
 * 2. `@atlaskit/css` exists but missing `cssMap` → add specifier
 * 3. No import → insert new `import { cssMap } from '@atlaskit/css'`
 */
export function upsertCssMapImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const cssImports = root.filter(
		(node): node is import('eslint-codemod-utils').ImportDeclaration =>
			node.type === 'ImportDeclaration' && node.source.value === CSS_IMPORT_MODULE,
	);

	if (cssImports.length > 0) {
		const decl = cssImports[0];
		const hasCssMap = Import.containsNamedSpecifier(decl, 'cssMap');

		if (hasCssMap) {
			return undefined;
		}

		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		specifiers.push('cssMap');
		specifiers.sort();

		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${CSS_IMPORT_MODULE}';`,
		);
	}

	// If cssMap is already imported from another package (e.g. @compiled/react), don't add a duplicate
	const cssMapAlreadyImported = root.some(
		(node) =>
			node.type === 'ImportDeclaration' &&
			(node as import('eslint-codemod-utils').ImportDeclaration).specifiers.some(
				(s) => s.type === 'ImportSpecifier' && s.local.name === 'cssMap',
			),
	);

	if (cssMapAlreadyImported) {
		return undefined;
	}

	return Root.upsertNamedImportDeclaration(
		{ module: CSS_IMPORT_MODULE, specifiers: ['cssMap'] },
		context,
		fixer,
	);
}
