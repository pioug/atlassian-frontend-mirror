import type {
	ASTPath,
	CallExpression,
	default as core,
	Identifier,
	ImportDeclaration,
	ImportDefaultSpecifier,
	ImportSpecifier,
	JSCodeshift,
	JSXAttribute,
	JSXElement,
	ObjectProperty,
	StringLiteral,
} from 'jscodeshift';
import { type Collection } from 'jscodeshift/src/Collection';

import { addCommentToStartOfFile, getNamedSpecifier } from '@atlaskit/codemod-utils';

export function hasImportDeclaration(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
) {
	return getImportDeclarationCollection(j, collection, importPath).length > 0;
}

export function getImportDeclarationCollection(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
) {
	return collection
		.find(j.ImportDeclaration)
		.filter((importDeclarationPath) => importDeclarationPath.node.source.value === importPath);
}

export function hasDynamicImport(j: JSCodeshift, collection: Collection<any>, importPath: string) {
	return getDynamicImportCollection(j, collection, importPath).length > 0;
}

export function getDynamicImportCollection(
	j: JSCodeshift,
	collection: Collection<any>,
	importPath: string,
) {
	return collection.find(j.CallExpression).filter((callExpressionPath) => {
		const { callee, arguments: callExpressionArguments } = callExpressionPath.node;

		return !!(
			isCallExpressionCalleeImportType(callee) &&
			isCallExpressionArgumentStringLiteralType(callExpressionArguments) &&
			isCallExpressionArgumentValueMatches(callExpressionArguments[0], j, importPath)
		);
	});
}
function isCallExpressionCalleeImportType(callee: CallExpression['callee']) {
	return callee && callee.type === 'Import';
}
function isCallExpressionArgumentStringLiteralType(
	callExpressionArguments: CallExpression['arguments'],
) {
	return (
		callExpressionArguments &&
		callExpressionArguments.length &&
		callExpressionArguments[0].type === 'StringLiteral'
	);
}
function isCallExpressionArgumentValueMatches(
	callExpressionArgument: CallExpression['arguments'][0],
	j: JSCodeshift,
	value: string,
) {
	return j(callExpressionArgument).some((path) => path.node.value === value);
}

export function getImportDefaultSpecifierCollection(
	j: JSCodeshift,
	importDeclarationCollection: Collection<ImportDeclaration>,
) {
	return importDeclarationCollection.find(j.ImportDefaultSpecifier);
}

export function getImportSpecifierCollection(
	j: JSCodeshift,
	importDeclarationCollection: Collection<ImportDeclaration>,
	importName: string,
) {
	return importDeclarationCollection
		.find(j.ImportSpecifier)
		.filter((importSpecifierPath) => importSpecifierPath.node.imported.name === importName);
}

export function getImportDefaultSpecifierName(
	importSpecifierCollection: Collection<ImportDefaultSpecifier>,
) {
	if (importSpecifierCollection.length === 0) {
		return null;
	}

	return importSpecifierCollection.nodes()[0]!.local!.name;
}

export function getImportSpecifierName(importSpecifierCollection: Collection<ImportSpecifier>) {
	if (importSpecifierCollection.length === 0) {
		return null;
	}

	return importSpecifierCollection.nodes()[0]!.local!.name;
}

export function isVariableDeclaratorIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
) {
	return collection
		.find(j.VariableDeclaration)
		.find(j.VariableDeclarator)
		.some((variableDeclaratorPath) => {
			const { id } = variableDeclaratorPath.node;

			return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
		});
}

export function isFunctionDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
) {
	return collection.find(j.FunctionDeclaration).some((functionDeclarationPath) => {
		const { id } = functionDeclarationPath.node;

		return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
	});
}

export function isClassDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
) {
	return collection.find(j.ClassDeclaration).some((classDeclarationPath) => {
		const { id } = classDeclarationPath.node;

		return !!(id && id.type === 'Identifier' && (id as Identifier).name === variableName);
	});
}

export function isImportDeclarationIdentifierPresent(
	j: JSCodeshift,
	collection: Collection<any>,
	variableName: string,
) {
	return collection
		.find(j.ImportDeclaration)
		.find(j.Identifier)
		.some((identifierPath) => identifierPath.node.name === variableName);
}

export function getJSXAttributesByName(
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): Collection<JSXAttribute> {
	return j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXAttribute)
		.filter((jsxAttributePath) =>
			j(jsxAttributePath)
				.find(j.JSXIdentifier)
				.some((jsxIdentifierPath) => jsxIdentifierPath.node.name === attributeName),
		);
}

export function getJSXSpreadIdentifierAttributesByName(
	j: JSCodeshift,
	collection: Collection<any>,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): Collection<ObjectProperty> | null {
	const identifierCollection = j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXSpreadAttribute)
		.filter((jsxSpreadAttributePath) => jsxSpreadAttributePath.node.argument.type === 'Identifier')
		.find(j.Identifier);

	if (identifierCollection.length === 0) {
		return null;
	}

	return collection
		.find(j.VariableDeclarator)
		.filter((variableDeclaratorPath) => {
			const { id } = variableDeclaratorPath.node;

			return (
				id.type === 'Identifier' &&
				identifierCollection.some((identifierPath) => identifierPath.node.name === id.name)
			);
		})
		.find(j.ObjectExpression)
		.find(j.ObjectProperty)
		.filter((objectPropertyPath) =>
			j(objectPropertyPath)
				.find(j.Identifier)
				.some((identifierPath) => identifierPath.node.name === attributeName),
		);
}

export function getJSXSpreadObjectExpressionAttributesByName(
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
) {
	return j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.find(j.JSXSpreadAttribute)
		.find(j.ObjectExpression)
		.find(j.ObjectProperty)
		.filter((objectPropertyPath) =>
			j(objectPropertyPath)
				.find(j.Identifier)
				.some((identifierPath) => identifierPath.node.name === attributeName),
		);
}

export const createRemoveFuncFor =
	(component: string, importName: string, prop: string, comment?: string) =>
	(j: core.JSCodeshift, source: Collection<Node>) => {
		const specifier = getNamedSpecifier(j, source, component, importName);

		if (!specifier) {
			return;
		}

		source.findJSXElements(specifier).forEach((element) => {
			getJSXAttributesByName(j, element, prop).forEach((attribute: any) => {
				j(attribute).remove();
				if (comment) {
					addCommentToStartOfFile({ j, base: source, message: comment });
				}
			});
		});
	};

export const getJSXAttributeByName = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attributeName: string,
): JSXAttribute | undefined => {
	const attributes: JSXAttribute[] = j(jsxElementPath).find(j.JSXAttribute).nodes();

	return attributes?.find((attr) => attr.name && attr.name.name === attributeName);
};

export const addJSXAttributeToJSXElement = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	jsxAttribute: JSXAttribute,
	limit?: number,
) => {
	j(jsxElementPath)
		.find(j.JSXOpeningElement)
		.forEach((openingElement, i) => {
			if (!limit || i < limit) {
				openingElement.node.attributes?.push(jsxAttribute);
			}
		});
};

export const removeJSXAttributeByName = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attrName: string,
) => {
	const attributes = getJSXAttributes(jsxElementPath);
	const attr = getJSXAttributeByName(j, jsxElementPath, attrName);
	if (attr) {
		attributes?.splice(attributes.indexOf(attr), 1);
	}
};

export const getJSXAttributes = (jsxElementPath: ASTPath<JSXElement>) =>
	jsxElementPath.node.openingElement.attributes as JSXAttribute[];

export const removeJSXAttributeObjectPropertyByName = (
	j: JSCodeshift,
	jsxElementPath: ASTPath<JSXElement>,
	attrName: string,
	propertyToRemove: string,
) => {
	const attr = getJSXAttributeByName(j, jsxElementPath, attrName);

	if (!attr) {
		return;
	}

	const attrCollection = getJSXAttributesByName(j, jsxElementPath, attrName);

	const removeMatchingNodes = (p: ASTPath<Identifier | StringLiteral>) => {
		const name = p.node.type === 'Identifier' ? p.node?.name : p.node?.value;
		// Need to account for quoted properties
		const nameMatches = propertyToRemove.match(new RegExp(`['"]?${name}['"]?`));
		// This will otherwise try to remove values of properties since they are literals
		const isKey = p.parent.value?.type === 'ObjectProperty';
		// Sorry about all the parents. This is the easiest way to get the name
		// of the attribute name. And I always know the depth of the object
		// property here.
		const parentNameMatches = attrName === p.parent.parent.parent.parent.node?.name?.name;
		if (isKey && nameMatches && parentNameMatches) {
			j(p.parent).remove();
		}
	};

	// Remove all the now migrated object properties
	const objectProperties = attrCollection.find(j.ObjectProperty);
	objectProperties.find(j.Identifier).forEach(removeMatchingNodes);
	objectProperties.find(j.StringLiteral).forEach(removeMatchingNodes);

	// @ts-ignore -- Property 'expression' does not exist on type 'LiteralKind | JSXElement | JSXExpressionContainer | JSXFragment'. Property 'expression' does not exist on type 'Literal'.
	const attrProperties = attr.value?.expression.properties;

	if (attrProperties && attrProperties?.length === 0) {
		removeJSXAttributeByName(j, jsxElementPath, attrName);
	}
};
