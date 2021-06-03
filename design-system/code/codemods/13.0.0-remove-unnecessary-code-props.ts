import { API, FileInfo, JSCodeshift, Options } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getImportDeclarationCollection,
  getImportSpecifierCollection,
  getImportSpecifierName,
  getJSXAttributesByName,
  getJSXSpreadIdentifierAttributesByName,
  getJSXSpreadObjectExpressionAttributesByName,
  hasImportDeclaration,
} from './utils/helpers';

const importPath = '@atlaskit/code';
const importName = 'Code';
const propsToBeRemoved = [
  'lineNumberContainerStyle',
  'showLineNumbers',
  'highlight',
];

function removeProps(
  j: JSCodeshift,
  collection: Collection<any>,
  elementName: string,
  propName: string,
) {
  collection.findJSXElements(elementName).forEach((jsxElementPath) => {
    const jsxAttributeCollection = getJSXAttributesByName(
      j,
      jsxElementPath,
      propName,
    );
    if (jsxAttributeCollection) {
      jsxAttributeCollection.remove();
    }

    const jsxSpreadIdentifierPropertyCollection = getJSXSpreadIdentifierAttributesByName(
      j,
      collection,
      jsxElementPath,
      propName,
    );
    if (jsxSpreadIdentifierPropertyCollection) {
      jsxSpreadIdentifierPropertyCollection.remove();
    }

    const jsxSpreadExpressionPropertyCollection = getJSXSpreadObjectExpressionAttributesByName(
      j,
      jsxElementPath,
      propName,
    );
    if (jsxSpreadExpressionPropertyCollection) {
      jsxSpreadExpressionPropertyCollection.remove();
    }
  });
}

function removePropsForImportSpecifiers(
  j: JSCodeshift,
  collection: Collection<any>,
  propName: string,
) {
  const importDeclarationCollection = getImportDeclarationCollection(
    j,
    collection,
    importPath,
  );
  const importSpecifierCollection = getImportSpecifierCollection(
    j,
    importDeclarationCollection,
    importName,
  );
  const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

  if (importSpecifierName === null) {
    return;
  }

  removeProps(j, collection, importSpecifierName, propName);
}

export default function transformer(
  fileInfo: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const { source } = fileInfo;
  const collection = j(source);

  if (!hasImportDeclaration(j, collection, importPath)) {
    return source;
  }

  propsToBeRemoved.forEach((propToRemove) => {
    removePropsForImportSpecifiers(j, collection, propToRemove);
  });

  return collection.toSource(options.printOptions || { quote: 'single' });
}
