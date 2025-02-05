import {
	ASTPath,
	ImportDeclaration,
	ImportDefaultSpecifier,
	ImportSpecifier,
	JSCodeshift,
} from 'jscodeshift';

import { WithStart } from '../types';

export function removeUnusedImports(
	importDeclarations: ASTPath<ImportDeclaration>[],
	j: JSCodeshift,
): void {
	const removeIfUnused = (
		importSpecifier: ASTPath<ImportSpecifier | ImportDefaultSpecifier>,
		importDeclaration: ASTPath<ImportDeclaration>,
	): boolean => {
		const varName = importSpecifier.value.local?.name;
		if (varName === 'React' || varName === 'jsx') {
			return false;
		}

		const isUsedInScopes = (): boolean => {
			return (
				j(importDeclaration)
					.closestScope()
					.find(j.Identifier, { name: varName })
					.filter((p) => {
						if (
							(p.value as WithStart).start === (importSpecifier.value.local as WithStart)?.start
						) {
							return false;
						}
						if (p.parentPath.value.type === 'Property' && p.name === 'key') {
							return false;
						}
						if (p.name === 'property') {
							return false;
						}
						return true;
					})
					.size() > 0
			);
		};

		if (!isUsedInScopes()) {
			j(importSpecifier).remove();
			return true;
		}
		return false;
	};

	const removeUnusedDefaultImport = (importDeclaration: ASTPath<ImportDeclaration>): boolean => {
		return (
			j(importDeclaration)
				.find(j.ImportDefaultSpecifier)
				.filter((s) => removeIfUnused(s, importDeclaration))
				.size() > 0
		);
	};

	const removeUnusedNonDefaultImports = (
		importDeclaration: ASTPath<ImportDeclaration>,
	): boolean => {
		return (
			j(importDeclaration)
				.find(j.ImportSpecifier)
				.filter((s) => removeIfUnused(s, importDeclaration))
				.size() > 0
		);
	};

	const processImportDeclaration = (importDeclaration: ASTPath<ImportDeclaration>): boolean => {
		if (importDeclaration.value.specifiers?.length === 0) {
			return false;
		}

		const hadUnusedDefaultImport = removeUnusedDefaultImport(importDeclaration);
		const hadUnusedNonDefaultImports = removeUnusedNonDefaultImports(importDeclaration);

		if (importDeclaration.value.specifiers?.length === 0) {
			j(importDeclaration).remove();
			return true;
		}
		return hadUnusedDefaultImport || hadUnusedNonDefaultImports;
	};

	importDeclarations.forEach(processImportDeclaration);
}
