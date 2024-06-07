// eslint-disable-next-line import/no-extraneous-dependencies
import type { SourceCode } from 'eslint';
import type { ImportDeclaration } from 'eslint-codemod-utils';

/**
 * @param {SourceCode} source The eslint source
 * @param {string} path The path specified to find
 * @returns {ImportDeclaration}
 */
export const getImportedNodeBySource = (source: SourceCode, path: string) => {
	return source.ast.body
		.filter((node): node is ImportDeclaration => node.type === 'ImportDeclaration')
		.find((node) => node.source.value === path);
};

/**
 * Returns the module name of an identifier, if one exists.
 *
 * getModuleOfIdentifier(source, 'Button'); // "@atlaskit/button"
 */
export const getModuleOfIdentifier = (
	source: SourceCode,
	identifierName: string,
): { moduleName: string; importName: string } | undefined => {
	for (const node of source.ast.body) {
		if (node.type === 'ImportDeclaration') {
			for (const spec of node.specifiers) {
				if (spec.type === 'ImportDefaultSpecifier' && spec.local.name === identifierName) {
					return {
						moduleName: node.source.value + '',
						importName: identifierName,
					};
				}

				if (spec.type === 'ImportSpecifier' && spec.local.name === identifierName) {
					return {
						moduleName: node.source.value + '',
						importName: spec.imported.name,
					};
				}
			}
		}
	}

	return undefined;
};
