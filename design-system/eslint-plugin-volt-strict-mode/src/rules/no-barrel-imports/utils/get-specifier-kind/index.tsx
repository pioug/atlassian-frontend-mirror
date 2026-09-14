import type { TSESTree } from '@typescript-eslint/utils';

export type SpecifierKind = 'type' | 'value';

export type SpecifierWithImportKind =
	| (TSESTree.ImportSpecifier & { importKind?: 'type' | 'value' })
	| TSESTree.ImportDefaultSpecifier
	| TSESTree.ImportNamespaceSpecifier;

/**
 * Whether a specifier is type-only — either the whole declaration is
 * `import type`, or the named specifier uses an inline `type` modifier.
 */
export function getSpecifierKind(
	node: TSESTree.ImportDeclaration,
	spec: SpecifierWithImportKind,
): SpecifierKind {
	if (node.importKind === 'type') {
		return 'type';
	}
	if (spec.type === 'ImportSpecifier' && spec.importKind === 'type') {
		return 'type';
	}
	return 'value';
}
