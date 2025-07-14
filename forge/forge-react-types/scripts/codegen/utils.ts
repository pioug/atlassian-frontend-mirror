import {
	type Symbol as TSSymbol,
	type TypeReferenceNode,
	type TypeNode,
	SyntaxKind,
} from 'ts-morph';

export const getTypeNodeFromSymbol = (symbol: TSSymbol): TypeNode | null => {
	const declaration = symbol.getDeclarations()[0];
	if (!declaration) {
		return null;
	}

	if (declaration.getKind() === SyntaxKind.TypeAliasDeclaration) {
		return declaration.asKindOrThrow(SyntaxKind.TypeAliasDeclaration).getTypeNode() ?? null;
	}

	return null;
};

type TypeFinderPredicate = (node: TypeNode) => boolean;

export const makePickOrOmitPredicate = (
	targetTypeName: 'Pick' | 'Omit',
	baseClassNamePrefix: string,
): TypeFinderPredicate => {
	return (node: TypeNode) => {
		const typeReferenceNode = node.asKind(SyntaxKind.TypeReference);
		if (!typeReferenceNode) {
			return false;
		}
		const typeName = typeReferenceNode.getTypeName().getText();
		if (typeName !== targetTypeName) {
			return false;
		}
		const baseNode = typeReferenceNode.getTypeArguments()[0]!;
		return baseNode.getText().startsWith(baseClassNamePrefix);
	};
};

export const findTypeReferenceFromUnionOrIntersect = (
	node: TypeNode,
	predicate: TypeFinderPredicate,
): TypeReferenceNode | null => {
	if (predicate(node)) {
		return node.asKindOrThrow(SyntaxKind.TypeReference);
	}
	if (node.getKind() === SyntaxKind.UnionType) {
		const unionNode = node.asKindOrThrow(SyntaxKind.UnionType);
		return (
			(unionNode.getTypeNodes().find((n) => {
				if (n.isKind(SyntaxKind.TypeReference)) {
					return predicate(n.asKindOrThrow(SyntaxKind.TypeReference));
				}
				return false;
			}) as TypeReferenceNode) ?? null
		);
	} else if (node.getKind() === SyntaxKind.IntersectionType) {
		const intersectionNode = node.asKindOrThrow(SyntaxKind.IntersectionType);
		return (
			(intersectionNode.getTypeNodes().find((n) => {
				if (n.isKind(SyntaxKind.TypeReference)) {
					return predicate(n.asKindOrThrow(SyntaxKind.TypeReference));
				}
				return false;
			}) as TypeReferenceNode) ?? null
		);
	}

	return null;
};
