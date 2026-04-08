import { type Identifier, type JSCodeshift } from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

export function isFunctionDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
): boolean {
	return collection.find(j.FunctionDeclaration).some((functionDeclarationPath) => {
		const { id } = functionDeclarationPath.node;

		return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
	});
}
