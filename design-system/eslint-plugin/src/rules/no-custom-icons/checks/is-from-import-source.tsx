import type { Rule } from 'eslint';
import type { ImportDeclaration } from 'eslint-codemod-utils';

import { type ImportedJSXElement, isImportedJSXElement } from './is-imported-jsx-element';

export function createIsFromImportSourceFor(...importSources: (string | RegExp)[]): {
    (node: Rule.Node): node is ImportedJSXElement;
    importDeclarationHook(node: ImportDeclaration): void;
    getImportSource(node: Rule.Node): string;
} {
	const literalImportSources = importSources.filter((s): s is string => typeof s === 'string');
	const matchImportSources = importSources.filter((s): s is RegExp => s instanceof RegExp);
	const varImportSourceMap = new Map<string, string>();

	function isFromImportSource(node: Rule.Node): node is ImportedJSXElement {
		return isImportedJSXElement(node) && varImportSourceMap.has(node.openingElement.name.name);
	}

	isFromImportSource.importDeclarationHook = (node: ImportDeclaration) => {
		const source = node.source.value;
		if (
			typeof source !== 'string' ||
			!(literalImportSources.includes(source) || matchImportSources.some((r) => r.test(source)))
		) {
			return;
		}
		node.specifiers
			.filter((spec) => ['ImportSpecifier', 'ImportDefaultSpecifier'].includes(spec.type))
			.forEach((spec) => varImportSourceMap.set(spec.local.name, source));
	};

	isFromImportSource.getImportSource = (node: Rule.Node) => {
		if (!isFromImportSource(node)) {
			throw new Error('Node is not an imported JSX element');
		}
		return varImportSourceMap.get(node.openingElement.name.name)!;
	};

	return isFromImportSource;
}
