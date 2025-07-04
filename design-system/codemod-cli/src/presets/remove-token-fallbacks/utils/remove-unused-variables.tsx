import { type ASTPath, type JSCodeshift, type VariableDeclarator } from 'jscodeshift';

import { type WithStart } from '../types';

export function removeUnusedVariables(
	variableDeclarations: ASTPath<VariableDeclarator>[],
	j: JSCodeshift,
): void {
	const removeIfUnused = (varDeclarator: ASTPath<VariableDeclarator>): boolean => {
		if (varDeclarator.value?.id.type !== 'Identifier') {
			return false;
		}

		const varName = varDeclarator.value.id.name;

		const isUsedInScopes = (): boolean => {
			return (
				j(varDeclarator)
					.closestScope()
					.find(j.Identifier, { name: varName })
					.filter((p) => {
						if ((p.value as WithStart).start === (varDeclarator.value.id as WithStart).start) {
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
			j(varDeclarator).remove();
			return true;
		}
		return false;
	};

	variableDeclarations.forEach(removeIfUnused);
}
