import { type JSCodeshift, type VariableDeclaration } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function hasVariableAssignment(
	j: JSCodeshift,
	source: ReturnType<typeof j>,
	identifierName: string,
): Collection<VariableDeclaration> | boolean {
	const occurance = source.find(j.VariableDeclaration).filter((path) => {
		return !!j(path.node)
			.find(j.VariableDeclarator)
			.find(j.Identifier)
			.filter((identifier) => {
				return identifier.node.name === identifierName;
			}).length;
	});
	return !!occurance.length ? occurance : false;
}
