import type { default as core } from 'jscodeshift';
import type { Collection } from 'jscodeshift/src/Collection';

/**
 * Finds import from a particular path/package matching a particular name.
 * Also deals with the case where import is renamed (ie. `import { X as Y } from 'Z';`)
 *
 * @param j
 * @param source The source collection.
 * @param pkg The path or package it came from.
 * @param importName The import identifier.
 * @returns String[] Array of result names which match the specified importName
 */
export const findImportFromPackage = (
	j: core.JSCodeshift,
	source: Collection<unknown>,
	pkg: string,
	importName: string,
): string[] => {
	// Find regular or renamed imports
	return (
		source
			// find all import statements which import from the given package
			.find(j.ImportDeclaration, {
				source: {
					value: pkg,
				},
			})
			// narrow down to imports related to 'component'
			.filter(
				(importDeclaration) =>
					j(importDeclaration).find(j.ImportSpecifier, {
						imported: {
							type: 'Identifier',
							name: importName,
						},
					}).length > 0,
			)
			.nodes()
			.map((importDeclaration): string => {
				const importSpecifier = j(importDeclaration)
					.find(j.ImportSpecifier, {
						imported: {
							type: 'Identifier',
							name: importName,
						},
					})
					.nodes()[0];

				return importSpecifier.local?.name || '';
			})
			.filter((name) => Boolean(name))
	);
};
