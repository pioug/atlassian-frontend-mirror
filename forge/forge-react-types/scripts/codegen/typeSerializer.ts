import {
	type Symbol as TSSymbol,
	type Node,
	type TypeChecker,
	type PropertySignature,
	type Type as TSType,
	SyntaxKind,
} from 'ts-morph';

export const serializeSymbolType = (
	symbol: TSSymbol,
	typeChecker: TypeChecker,
): [string, Set<string>] => {
	const declaration = symbol.getDeclarations()[0];

	if (!declaration) {
		throw new Error(`No declaration found for symbol: ${symbol.getName()}`);
	}

	const usedExternalTypes = new Set<string>();
	if (declaration.getKind() === SyntaxKind.TypeAliasDeclaration) {
		const typeAlias = declaration.asKindOrThrow(SyntaxKind.TypeAliasDeclaration);
		const typeNode = typeAlias.getTypeNode();
		if (typeNode && isCommonComponentPropType(typeNode)) {
			const serializedType = flattenPickType(
				typeNode.asKindOrThrow(SyntaxKind.TypeReference),
				typeChecker,
				usedExternalTypes,
			);
			return [serializedType, usedExternalTypes];
		}
	}

	throw new Error(
		`Unsupported declaration kind: ${declaration.getKindName()} for symbol: ${symbol.getName()}`,
	);
};

/**
 * Checks if a node is a common component prop type. e.g.
 *
 * export type BleedProps = Pick<
 *   PlatformBleedProps,
 *   'children' | 'all' | 'inline' | 'block' | 'testId' | 'role'
 * >;
 */
const isCommonComponentPropType = (node: Node) => {
	if (node.getKind() === SyntaxKind.TypeReference) {
		const typeRef = node.asKindOrThrow(SyntaxKind.TypeReference);
		const typeName = typeRef.getTypeName().getText();
		return typeName === 'Pick';
	}
	return false;
};

// resolve single level type references (e.g. SupportedLanguages))
// type SupportedLanguages = 'text' | 'PHP' | 'Java' | 'CSharp' | ...;
const isSimpleTypeReferenceNode = (node: Node): boolean => {
	const type = node.getType();
	if (type.isUnion()) {
		const unionTypes = type.getUnionTypes();
		return unionTypes.every((t) => {
			return t.isString() || t.isStringLiteral() || t.isNumber() || t.isBoolean();
		});
	}
	return false;
};

const serializeSimpleTypeNode = (node: Node): string => {
	switch (node.getKind()) {
		case SyntaxKind.UnionType:
			const unionType = node.asKindOrThrow(SyntaxKind.UnionType);
			const unionTypes = unionType.getTypeNodes().map((t) => serializeSimpleTypeNode(t));
			return unionTypes.join(' | ');

		case SyntaxKind.StringLiteral:
			return `'${node.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()}'`;
		case SyntaxKind.TypeReference:
			// resolve single level type references (e.g. SupportedLanguages))
			if (isSimpleTypeReferenceNode(node)) {
				return node
					.getType()
					.getUnionTypes()
					.map((t) => t.getText())
					.join(' | ');
			}
	}
	return node.getText();
};

const serializePropertySignatureCode = (propertySignature: PropertySignature) => {
	return `${propertySignature.getName()}: ${serializeSimpleTypeNode(propertySignature.getTypeNode()!)};`;
};

const flattenPickType = (
	typeRef: Node,
	typeChecker: TypeChecker,
	usedExternalTypesOutput: Set<string>,
): string => {
	const typeArgs = typeRef.asKindOrThrow(SyntaxKind.TypeReference).getTypeArguments();

	if (typeArgs.length < 2) {
		return typeRef.getText(); // Fallback if not a valid Pick
	}

	const keysNode = typeArgs[1];

	// Get the selected keys
	const selectedKeys = extractUnionKeys(keysNode);

	// Get the base type symbol
	const properties = typeRef
		.getType()
		.getProperties()
		.filter((prop) => selectedKeys.includes(prop.getName()));

	if (properties.length === 0) {
		return '{}'; // If no properties match, return 'any'
	}

	const serializedProperties = properties
		.map((prop) => {
			const propertySignature = prop.getDeclarations()[0] as PropertySignature | undefined;
			if (!propertySignature) {
				return null; // Skip if no declaration
			}
			const jsDoc = propertySignature.getJsDocs()?.[0]?.getText();
			const typeCode = `\t${serializePropertySignatureCode(propertySignature)}`;
			getUnresolvableTypes(propertySignature.getType()).forEach((typeName) => {
				usedExternalTypesOutput.add(typeName);
			});
			return [jsDoc, typeCode].filter(Boolean).join('\n');
		})
		.filter(Boolean);

	if (serializedProperties.length === 0) {
		return '{}'; // If no properties are serialized, return empty object
	}
	return `{\n  ${serializedProperties.join('\n  ')}\n}`;
};

const getUnresolvableTypes = (tsType: TSType) => {
	const unresolvableTypes = new Set<string>();
	getUnresolvableTypesBase(tsType, unresolvableTypes);
	return unresolvableTypes;
};

const getUnresolvableTypesBase = (tsType: TSType, unresolvableTypes: Set<string>) => {
	if (isExternalType(tsType)) {
		unresolvableTypes.add(tsType.getText());
	} else if (tsType.isUnion()) {
		const unionTypes = tsType.getUnionTypes();
		unionTypes.forEach((type) => {
			getUnresolvableTypesBase(type, unresolvableTypes);
		});
	} else if (!isBasicType(tsType)) {
		unresolvableTypes.add(tsType.getText());
	}
};

const isBasicType = (tsType: TSType): boolean => {
	return (
		tsType.isString() ||
		tsType.isNumber() ||
		tsType.isBoolean() ||
		tsType.isNull() ||
		tsType.isUndefined() ||
		tsType.isAny() ||
		tsType.isUnknown() ||
		tsType.isNever()
	);
};

const isExternalType = (tsType: TSType): boolean => {
	const symbol = tsType.getSymbol() ?? tsType.getAliasSymbol();
	if (!symbol) {
		return false;
	}

	const declaration = symbol.getDeclarations()?.[0];
	if (!declaration) {
		return false;
	}

	const sourceFile = declaration.getSourceFile();
	const filePath = sourceFile.getFilePath();

	return filePath.includes('node_modules');
};

const extractUnionKeys = (keysNode: Node): string[] => {
	if (keysNode.getKind() === SyntaxKind.UnionType) {
		const unionType = keysNode.asKindOrThrow(SyntaxKind.UnionType);
		return unionType.getTypeNodes().map((node) => {
			if (node.getKind() === SyntaxKind.StringLiteral) {
				return node.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
			}
			return node.getText().replace(/['"]/g, '');
		});
	} else if (keysNode.getKind() === SyntaxKind.StringLiteral) {
		return [keysNode.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()];
	}

	return [keysNode.getText().replace(/['"]/g, '')];
};
