import { type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { type Nullable } from '../types';

import { addCommentToStartOfFile } from './add-comment-to-start-of-file';

export const createRemoveImportsFor: ({
	importsToRemove,
	packagePath,
	comment,
}: {
	importsToRemove: string[];
	packagePath: string;
	comment: string;
}) => (j: JSCodeshift, source: Collection<Node>) => void =
	({
		importsToRemove,
		packagePath,
		comment,
	}: {
		importsToRemove: string[];
		packagePath: string;
		comment: string;
	}) =>
	(j: JSCodeshift, source: Collection<Node>) => {
		const isUsingName: boolean =
			source.find(j.ImportDeclaration).filter((path) => path.node.source.value === packagePath)
				.length > 0;
		if (!isUsingName) {
			return;
		}

		const existingAlias: Nullable<string> =
			source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === packagePath)
				.find(j.ImportSpecifier)
				.nodes()
				.map((specifier): Nullable<string> => {
					if (!importsToRemove.includes(specifier.imported.name)) {
						return null;
					}
					// If aliased: return the alias
					if (specifier.local && !importsToRemove.includes(specifier.local.name)) {
						return specifier.local.name;
					}

					return null;
				})
				.filter(Boolean)[0] || null;

		// Remove imports
		source
			.find(j.ImportDeclaration)
			.filter((path) => path.node.source.value === packagePath)
			.find(j.ImportSpecifier)
			.find(j.Identifier)
			.filter((identifier) => {
				if (
					importsToRemove.includes(identifier.value.name) ||
					identifier.value.name === existingAlias
				) {
					addCommentToStartOfFile({ j, base: source, message: comment });
					return true;
				}
				return false;
			})
			.remove();

		// Remove entire import if it is empty
		const isEmptyImport =
			source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === packagePath)
				.find(j.ImportSpecifier)
				.find(j.Identifier).length === 0;
		if (isEmptyImport) {
			source
				.find(j.ImportDeclaration)
				.filter((path) => path.node.source.value === packagePath)
				.remove();
		}
	};
