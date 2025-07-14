import {
	type Node,
	type PropertySignature,
	type Type as TSType,
	type UnionTypeNode,
	type TypeReferenceNode,
	SyntaxKind,
} from 'ts-morph';

type PropertyCallback = ({
	jsDoc,
	typeCode,
	propertySignature,
}: {
	jsDoc?: string;
	typeCode: string;
	propertySignature: PropertySignature;
}) => {
	jsDoc?: string;
	typeCode: string;
} | null;

export const serializeTypeReferenceWithPickType = (
	typeReference: TypeReferenceNode,
	propertyCallback: PropertyCallback,
): [string, Set<string>] => {
	const usedExternalTypes = new Set<string>();
	const serializedType = flattenPickType(typeReference, usedExternalTypes, propertyCallback);
	return [serializedType, usedExternalTypes];
};

// resolve single level type references (e.g. SupportedLanguages))
// type SupportedLanguages = 'text' | 'PHP' | 'Java' | 'CSharp' | ...;
const isSimpleTypeReferenceNode = (tsType: TSType): boolean => {
	if (tsType.isUnion()) {
		const unionTypes = tsType.getUnionTypes();
		return unionTypes.every((t) => isBasicType(t));
	}
	return false;
};

// event function type that is not a React event handler
const isCustomEventHandlerType = (tsType: TSType): boolean => {
	const callSignatures = tsType.getCallSignatures();
	// we already import React, hence we don't have to serialize it
	if (
		callSignatures.length > 0 &&
		callSignatures[0].getParameters().length > 1 &&
		!tsType.getText().startsWith('React.')
	) {
		const analyticsEventSymbol = callSignatures[0].getParameters()[1];
		if (analyticsEventSymbol) {
			const eventTypeName = analyticsEventSymbol
				.getDeclarations()[0]
				.asKind(SyntaxKind.Parameter)
				?.getTypeNode()
				?.getText();
			return eventTypeName === 'UIAnalyticsEvent';
		}
		return true;
	}
	return false;
};

const serializeSimpleEventType = (tsType: TSType): string => {
	const propertyCode: string[] = tsType
		.getProperties()
		.map((prop) => {
			const propertySignature = prop.getDeclarations()[0] as PropertySignature | undefined;
			if (propertySignature) {
				const typeCode = serializeSimpleTypeNode(resolveNonNullableType(propertySignature));
				return `${prop.getName()}: ${typeCode}`;
			}
			return null;
		})
		.filter(Boolean) as string[];
	return `{ ${propertyCode.join(', ')} }`;
};

const serializeCustomEventHandlerType = (tsType: TSType): string => {
	const callSignature = tsType.getCallSignatures()[0];
	const eventSymbol = callSignature.getParameters()[0];
	const parameterDeclaration = eventSymbol.getDeclarations()[0].asKindOrThrow(SyntaxKind.Parameter);
	const eventType = parameterDeclaration.getType();
	const analyticsEventName = callSignature.getParameters()[1]?.getName() ?? 'analyticsEvent';
	const returnType = callSignature.getReturnType().getText();
	return `(${eventSymbol.getName()}: ${serializeSimpleEventType(eventType)}, ${analyticsEventName}: any) => ${returnType}`;
};

const serializeSimpleTypeNode = (tsType: TSType): string => {
	if (tsType.isStringLiteral()) {
		return `'${tsType.getLiteralValue()}'`;
	} else if (isBasicType(tsType)) {
		return tsType.getText();
	} else if (isSimpleTypeReferenceNode(tsType)) {
		const unionTypes = tsType.getUnionTypes();
		const serializedTypes = unionTypes.map((t) => serializeSimpleTypeNode(t));
		return serializedTypes.join(' | ');
	} else if (isCustomEventHandlerType(tsType)) {
		return serializeCustomEventHandlerType(tsType);
	}
	return tsType.getText();
};

const resolveNonNullableType = (propertySignature: PropertySignature): TSType => {
	const hasOptionalHint = propertySignature.hasQuestionToken();
	const type = propertySignature.getType();
	if (!hasOptionalHint) {
		return type;
	}
	// there is a case where `children?: ReactNode` using getNonNullableType() don't return the original ReactNode type
	if (type.getText().split(' | ').includes('undefined')) {
		return type.getNonNullableType();
	}
	return type;
};

const serializePropertySignatureCode = (propertySignature: PropertySignature) => {
	const propertyName = propertySignature.getName();
	const isOptional = propertySignature.hasQuestionToken();
	const typeCode = serializeSimpleTypeNode(resolveNonNullableType(propertySignature));
	return `${propertyName}${isOptional ? '?' : ''}: ${typeCode};`;
};

const flattenPickType = (
	typeRef: Node,
	usedExternalTypesOutput: Set<string>,
	propertyCallback: PropertyCallback,
): string => {
	const pickKeys = extractPickKeys(typeRef.asKindOrThrow(SyntaxKind.TypeReference));
	const properties = typeRef
		.getType()
		.getProperties()
		.filter((prop) => pickKeys.includes(prop.getName()));

	if (properties.length === 0) {
		return '{}'; // If no properties match, return 'any'
	}

	const serializedProperties = properties
		.map((prop) => {
			const propertySignature = prop.getDeclarations()[0] as PropertySignature | undefined;
			if (!propertySignature) {
				return null; // Skip if no declaration
			}
			const { jsDoc, typeCode } =
				propertyCallback({
					propertySignature,
					jsDoc: propertySignature.getJsDocs()?.[0]?.getText(),
					typeCode: serializePropertySignatureCode(propertySignature),
				}) || {};
			getUnresolvableTypes(propertySignature.getType()).forEach((typeName) => {
				usedExternalTypesOutput.add(typeName);
			});
			return `${jsDoc ?? ''}\n\t${typeCode}`;
		})
		.filter(Boolean);

	if (serializedProperties.length === 0) {
		return '{}'; // If no properties are serialized, return empty object
	}
	return `{\n${serializedProperties.map((prop) => (!!prop?.trim() ? `  ${prop}` : '')).join('\n')}\n}`;
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
		tsType.isStringLiteral() ||
		tsType.isNumber() ||
		tsType.isNumberLiteral() ||
		tsType.isBoolean() ||
		tsType.isBooleanLiteral() ||
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

export const extractUnionKeysFromTypeReferenceNode = (
	typeReferenceNode: TypeReferenceNode,
	targetTypeName: 'Pick' | 'Omit',
): string[] => {
	const typeName = typeReferenceNode.getTypeName().getText();
	if (typeName !== targetTypeName) {
		throw new Error(`Expected '${targetTypeName}' type, but found '${typeName}'`);
	}
	const typeArgs = typeReferenceNode.getTypeArguments();
	if (typeArgs.length !== 2) {
		throw new Error(
			`Expected 2 type arguments for ${targetTypeName}, but found ${typeArgs.length}`,
		);
	}
	const unionType = typeArgs[1];
	return extractUnionKeys(unionType);
};

export const extractOmitKeys = (typeReferenceNode: TypeReferenceNode): string[] => {
	return extractUnionKeysFromTypeReferenceNode(typeReferenceNode, 'Omit');
};

export const extractPickKeys = (typeReferenceNode: TypeReferenceNode): string[] => {
	return extractUnionKeysFromTypeReferenceNode(typeReferenceNode, 'Pick');
};

const unwrapStringQuotes = (str: string): string => {
	return str.replace(/['"]/g, '');
};

const extractUnionKeysFromUnionType = (unionType: UnionTypeNode): string[] => {
	return unionType.getTypeNodes().map((node) => {
		if (node.getKind() === SyntaxKind.StringLiteral) {
			return node.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue();
		}
		return unwrapStringQuotes(node.getText());
	});
};

const extractUnionKeys = (keysNode: Node): string[] => {
	if (keysNode.getKind() === SyntaxKind.UnionType) {
		const unionType = keysNode.asKindOrThrow(SyntaxKind.UnionType);
		return extractUnionKeysFromUnionType(unionType);
	} else if (keysNode.getKind() === SyntaxKind.StringLiteral) {
		return [keysNode.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralValue()];
	}
	return [unwrapStringQuotes(keysNode.getText())];
};
