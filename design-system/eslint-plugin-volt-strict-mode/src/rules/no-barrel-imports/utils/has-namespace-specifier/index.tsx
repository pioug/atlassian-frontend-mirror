import type { TSESTree } from '@typescript-eslint/utils';

/**
 * True when the import uses a namespace specifier (`import * as X from '…'`).
 */
export function hasNamespaceSpecifier(node: TSESTree.ImportDeclaration): boolean {
	return node.specifiers.some((spec) => spec.type === 'ImportNamespaceSpecifier');
}
