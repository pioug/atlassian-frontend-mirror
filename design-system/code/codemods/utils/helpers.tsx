import core, {
  ASTPath,
  CallExpression,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSCodeshift,
  JSXElement,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getNamedSpecifier,
} from '@atlaskit/codemod-utils';

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
    .filter(
      (importDeclarationPath) =>
        importDeclarationPath.node.source.value === importPath,
    );
}

export function hasDynamicImport(
  j: JSCodeshift,
  collection: Collection<any>,
  importPath: string,
) {
  return getDynamicImportCollection(j, collection, importPath).length > 0;
}

export function getDynamicImportCollection(
  j: JSCodeshift,
  collection: Collection<any>,
  importPath: string,
) {
  return collection.find(j.CallExpression).filter((callExpressionPath) => {
    const {
      callee,
      arguments: callExpressionArguments,
    } = callExpressionPath.node;

    return !!(
      isCallExpressionCalleeImportType(callee) &&
      isCallExpressionArgumentStringLiteralType(callExpressionArguments) &&
      isCallExpressionArgumentValueMatches(
        callExpressionArguments[0],
        j,
        importPath,
      )
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

export function getImportSpecifierCollection(
  j: JSCodeshift,
  importDeclarationCollection: Collection<ImportDeclaration>,
  importName: string,
) {
  return importDeclarationCollection
    .find(j.ImportSpecifier)
    .filter(
      (importSpecifierPath) =>
        importSpecifierPath.node.imported.name === importName,
    );
}

export function getImportSpecifierName(
  importSpecifierCollection: Collection<ImportSpecifier>,
) {
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

      return !!(
        id &&
        id.type === 'Identifier' &&
        (id as Identifier).name === variableName
      );
    });
}

export function isFunctionDeclarationIdentifierPresent(
  j: JSCodeshift,
  collection: Collection<any>,
  variableName: string,
) {
  return collection
    .find(j.FunctionDeclaration)
    .some((functionDeclarationPath) => {
      const { id } = functionDeclarationPath.node;

      return !!(
        id &&
        id.type === 'Identifier' &&
        (id as Identifier).name === variableName
      );
    });
}

export function isClassDeclarationIdentifierPresent(
  j: JSCodeshift,
  collection: Collection<any>,
  variableName: string,
) {
  return collection.find(j.ClassDeclaration).some((classDeclarationPath) => {
    const { id } = classDeclarationPath.node;

    return !!(
      id &&
      id.type === 'Identifier' &&
      (id as Identifier).name === variableName
    );
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
) {
  return j(jsxElementPath)
    .find(j.JSXOpeningElement)
    .find(j.JSXAttribute)
    .filter((jsxAttributePath) =>
      j(jsxAttributePath)
        .find(j.JSXIdentifier)
        .some(
          (jsxIdentifierPath) => jsxIdentifierPath.node.name === attributeName,
        ),
    );
}

export function getJSXSpreadIdentifierAttributesByName(
  j: JSCodeshift,
  collection: Collection<any>,
  jsxElementPath: ASTPath<JSXElement>,
  attributeName: string,
) {
  const identifierCollection = j(jsxElementPath)
    .find(j.JSXOpeningElement)
    .find(j.JSXSpreadAttribute)
    .filter(
      (jsxSpreadAttributePath) =>
        jsxSpreadAttributePath.node.argument.type === 'Identifier',
    )
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
        identifierCollection.some(
          (identifierPath) => identifierPath.node.name === id.name,
        )
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

export const createRemoveFuncFor = (
  component: string,
  importName: string,
  prop: string,
  comment?: string,
) => (j: core.JSCodeshift, source: Collection<Node>) => {
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
