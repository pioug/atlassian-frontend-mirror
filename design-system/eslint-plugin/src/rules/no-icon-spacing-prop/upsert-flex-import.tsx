import type { Rule } from 'eslint';

import { getSourceCode } from '@atlaskit/eslint-utils/context-compat';

import { Import } from '../../ast-nodes/import';
import { Root } from '../../ast-nodes/root';

const FLEX_IMPORT_MODULE = '@atlaskit/primitives/compiled';
const FLEX_IMPORT_MODULE_NON_COMPILED = '@atlaskit/primitives';

/**
 * Upserts `Flex` from `@atlaskit/primitives/compiled`, handling:
 * 1. Already imported from `/compiled` → add Flex if missing
 * 2. Import from `@atlaskit/primitives` (non-compiled) → migrate path + add Flex
 * 3. No import → insert new `import { Flex } from '@atlaskit/primitives/compiled'`
 */
export function upsertFlexImport(
	context: Rule.RuleContext,
	fixer: Rule.RuleFixer,
): Rule.Fix | undefined {
	const root = getSourceCode(context).ast.body;

	const findExactImports = (module: string) =>
		root.filter(
			(node): node is import('eslint-codemod-utils').ImportDeclaration =>
				node.type === 'ImportDeclaration' && node.source.value === module,
		);

	const compiledImports = findExactImports(FLEX_IMPORT_MODULE);
	if (compiledImports.length > 0) {
		const decl = compiledImports[0];
		if (Import.containsNamedSpecifier(decl, 'Flex')) {
			return undefined;
		}
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		specifiers.push('Flex');
		specifiers.sort();
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${FLEX_IMPORT_MODULE}';`,
		);
	}

	const nonCompiledImports = findExactImports(FLEX_IMPORT_MODULE_NON_COMPILED);
	if (nonCompiledImports.length > 0) {
		const decl = nonCompiledImports[0];
		const specifiers = decl.specifiers
			.filter((s) => s.type === 'ImportSpecifier')
			.map((s) => s.local.name);
		if (!specifiers.includes('Flex')) {
			specifiers.push('Flex');
		}
		specifiers.sort();
		return fixer.replaceText(
			decl,
			`import { ${specifiers.join(', ')} } from '${FLEX_IMPORT_MODULE}';`,
		);
	}

	return Root.upsertNamedImportDeclaration(
		{ module: FLEX_IMPORT_MODULE, specifiers: ['Flex'] },
		context,
		fixer,
	);
}
