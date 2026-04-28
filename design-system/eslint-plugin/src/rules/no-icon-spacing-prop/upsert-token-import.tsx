import type { Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Import } from '../../ast-nodes/import';
import { Root } from '../../ast-nodes/root';

const TOKEN_IMPORT_MODULE = '@atlaskit/tokens';

/**
 * Upserts `token` from `@atlaskit/tokens`, handling:
 * 1. Already imported → no-op
 * 2. `@atlaskit/tokens` exists but missing `token` → add specifier
 * 3. No import → insert new `import { token } from '@atlaskit/tokens'`
 */
export function upsertTokenImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const tokenImports = root.filter(
		(node): node is import('eslint-codemod-utils').ImportDeclaration =>
			node.type === 'ImportDeclaration' && node.source.value === TOKEN_IMPORT_MODULE,
	);

	if (tokenImports.length > 0) {
		const decl = tokenImports[0];
		if (Import.containsNamedSpecifier(decl, 'token')) {
			return undefined;
		}
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		specifiers.push('token');
		specifiers.sort();
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${TOKEN_IMPORT_MODULE}';`,
		);
	}

	return Root.upsertNamedImportDeclaration(
		{ module: TOKEN_IMPORT_MODULE, specifiers: ['token'] },
		context,
		fixer,
	);
}
