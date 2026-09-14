import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Resolve the imported export name from a named import specifier
 * (handles Identifier and string Literal imported forms).
 */
export function getImportedName(spec: TSESTree.ImportSpecifier): string {
	const imported = spec.imported as TSESTree.Identifier | TSESTree.Literal;
	return imported.type === 'Identifier' ? imported.name : String(imported.value);
}
