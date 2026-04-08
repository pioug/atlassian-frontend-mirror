import { type Identifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function isClassDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
): boolean {
	return collection.find(j.ClassDeclaration).some((classDeclarationPath) => {
		const { id } = classDeclarationPath.node;

		return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
	});
}
