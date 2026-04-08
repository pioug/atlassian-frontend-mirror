import { type ImportDefaultSpecifier, type ImportSpecifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addToImport } from './add-to-import';
import { tryCreateImport } from './try-create-import';
import { type Nullable } from './types';

export const createRenameImportFor: ({
	componentName,
	newComponentName,
	oldPackagePath,
	newPackagePath,
}: {
	componentName: string;
	newComponentName?: string;
	oldPackagePath: string;
	newPackagePath: string;
}) => (j: JSCodeshift, source: Collection<Node>) => void =
	({
		componentName,
		newComponentName,
		oldPackagePath,
		newPackagePath,
	}: {
		componentName: string;
		newComponentName?: string;
		oldPackagePath: string;
		newPackagePath: string;
	}) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const isUsingName: boolean =
			source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === oldPackagePath)
				.find(j.ImportSpecifier)
				.nodes()
				.filter((specifier) => specifier.imported && specifier.imported.name === componentName)
				.length > 0;
		if (!isUsingName) {
			return;
		}

		const existingAlias: Nullable<string> =
			source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === oldPackagePath)
				.find(j.ImportSpecifier)
				.nodes()
				.map((specifier): Nullable<string> => {
					if (specifier.imported && specifier.imported.name !== componentName) {
						return null;
					}
					// If aliased: return the alias
					if (specifier.local && specifier.local.name !== componentName) {
						return specifier.local.name;
					}

					return null;
				})
				.filter(Boolean)[0] || null;

		// Check to see if need to create new package path
		// Try create an import declaration just before the old import
		tryCreateImport({
			j,
			base: source,
			relativeToPackage: oldPackagePath,
			packageName: newPackagePath,
		});

		const newSpecifier: ImportSpecifier | ImportDefaultSpecifier = (() => {
			// If there's a new name use that
			if (newComponentName) {
				return j.importSpecifier(j.identifier(newComponentName), j.identifier(newComponentName));
			}

			if (existingAlias) {
				return j.importSpecifier(j.identifier(componentName), j.identifier(existingAlias));
			}

			// Add specifier
			return j.importSpecifier(j.identifier(componentName), j.identifier(componentName));
		})();

		addToImport({
			j,
			base: source,
			importSpecifier: newSpecifier,
			packageName: newPackagePath,
		});

		// Remove old path
		source
			.find(j.ImportDeclaration)
			.filter((path) => path.node.source.value === oldPackagePath)
			.remove();
	};
