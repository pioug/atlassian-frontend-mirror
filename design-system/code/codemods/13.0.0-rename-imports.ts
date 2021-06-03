import {
  API,
  ASTPath,
  FileInfo,
  Identifier,
  ImportSpecifier,
  JSCodeshift,
  Options,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDynamicImportCollection,
  getImportDeclarationCollection,
  getImportSpecifierCollection,
  getImportSpecifierName,
  hasDynamicImport,
  hasImportDeclaration,
  isClassDeclarationIdentifierPresent,
  isFunctionDeclarationIdentifierPresent,
  isImportDeclarationIdentifierPresent,
  isVariableDeclaratorIdentifierPresent,
} from './utils/helpers';

const importPath = '@atlaskit/code';
const importsMapping = {
  oldImports: {
    Code: 'AkCode',
    CodeBlock: 'AkCodeBlock',
  },
  newImports: {
    Code: 'Code',
    CodeBlock: 'CodeBlock',
  },
};

function renameNamedImports(
  j: JSCodeshift,
  collection: Collection<any>,
  {
    fromImportName,
    toImportName,
  }: {
    fromImportName: string;
    toImportName: string;
  },
) {
  const importDeclarationCollection = getImportDeclarationCollection(
    j,
    collection,
    importPath,
  );
  const importSpecifierCollection = getImportSpecifierCollection(
    j,
    importDeclarationCollection,
    fromImportName,
  );
  const importSpecifierName = getImportSpecifierName(importSpecifierCollection);

  if (importSpecifierName === null) {
    return;
  }

  importSpecifierCollection.forEach((importSpecifierPath) => {
    renameBasedOnImportAlias(
      j,
      collection,
      importSpecifierPath,
      importSpecifierName,
      {
        fromImportName,
        toImportName,
      },
    );
  });
}

function renameBasedOnImportAlias(
  j: JSCodeshift,
  collection: Collection<any>,
  importSpecifierPath: ASTPath<ImportSpecifier>,
  importSpecifierName: string,
  {
    fromImportName,
    toImportName,
  }: {
    fromImportName: string;
    toImportName: string;
  },
) {
  const isImportAliasPresent = importSpecifierName !== fromImportName;

  if (isImportAliasPresent) {
    return renameOnlyImportName(j, importSpecifierPath, importSpecifierName, {
      toImportName,
    });
  }

  const isToImportNameIdentifierPresentInSourceCode =
    isVariableDeclaratorIdentifierPresent(j, collection, toImportName) ||
    isFunctionDeclarationIdentifierPresent(j, collection, toImportName) ||
    isClassDeclarationIdentifierPresent(j, collection, toImportName) ||
    isImportDeclarationIdentifierPresent(j, collection, toImportName);

  if (isToImportNameIdentifierPresentInSourceCode) {
    return renameOnlyImportNameWithAliasAddition(j, importSpecifierPath, {
      fromImportName,
      toImportName,
    });
  }

  return renameImportNameWithItsUsage(j, collection, importSpecifierPath, {
    fromImportName,
    toImportName,
  });
}

function renameOnlyImportName(
  j: JSCodeshift,
  importSpecifierPath: ASTPath<ImportSpecifier>,
  importSpecifierName: string,
  {
    toImportName,
  }: {
    toImportName: string;
  },
) {
  j(importSpecifierPath).replaceWith(
    j.importSpecifier(
      j.identifier(toImportName),
      j.identifier(importSpecifierName),
    ),
  );
}

function renameOnlyImportNameWithAliasAddition(
  j: JSCodeshift,
  importSpecifierPath: ASTPath<ImportSpecifier>,
  {
    fromImportName,
    toImportName,
  }: {
    fromImportName: string;
    toImportName: string;
  },
) {
  j(importSpecifierPath).replaceWith(
    j.importSpecifier(j.identifier(toImportName), j.identifier(fromImportName)),
  );
}

function renameImportNameWithItsUsage(
  j: JSCodeshift,
  collection: Collection<any>,
  importSpecifierPath: ASTPath<ImportSpecifier>,
  {
    fromImportName,
    toImportName,
  }: {
    fromImportName: string;
    toImportName: string;
  },
) {
  j(importSpecifierPath).replaceWith(
    j.importSpecifier(j.identifier(toImportName), j.identifier(toImportName)),
  );

  collection
    .find(j.JSXIdentifier)
    .filter(
      (jsxIdentifierPath) => jsxIdentifierPath.node.name === fromImportName,
    )
    .forEach((jsxIdentifierPath) => {
      j(jsxIdentifierPath).replaceWith(j.identifier(toImportName));
    });

  collection.find(j.CallExpression).forEach((callExpressionPath) => {
    const { arguments: callExpressionArguments } = callExpressionPath.node;

    callExpressionPath.node.arguments = callExpressionArguments.map(
      (argument) => {
        if (
          argument.type === 'Identifier' &&
          argument.name === fromImportName
        ) {
          return j.identifier(toImportName);
        }

        return argument;
      },
    );
  });

  collection.find(j.VariableDeclarator).forEach((variableDeclaratorPath) => {
    const { init } = variableDeclaratorPath.node;

    if (
      init &&
      init.type === 'Identifier' &&
      (init as Identifier).name === fromImportName
    ) {
      variableDeclaratorPath.node.init = j.identifier(toImportName);
    }
  });
}

function addPromiseThenIdentifier(j: JSCodeshift, collection: Collection<any>) {
  const thenArgument = 'module';

  getDynamicImportCollection(j, collection, importPath).forEach(
    (callExpressionPath) => {
      j(callExpressionPath).replaceWith(
        j.callExpression(
          j.memberExpression(callExpressionPath.node, j.identifier('then')),
          [
            j.arrowFunctionExpression(
              [j.identifier(thenArgument)],
              j.objectExpression([
                j.objectProperty(
                  j.identifier(importsMapping.oldImports.Code),
                  j.memberExpression(
                    j.identifier(thenArgument),
                    j.identifier(importsMapping.newImports.Code),
                  ),
                ),
                j.objectProperty(
                  j.identifier(importsMapping.oldImports.CodeBlock),
                  j.memberExpression(
                    j.identifier(thenArgument),
                    j.identifier(importsMapping.newImports.CodeBlock),
                  ),
                ),
              ]),
            ),
          ],
        ),
      );
    },
  );
}

export default function transformer(
  fileInfo: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const { source } = fileInfo;
  const collection = j(source);

  const hasCodeImportDeclaration = hasImportDeclaration(
    j,
    collection,
    importPath,
  );

  const hasDynamicImportCode = hasDynamicImport(j, collection, importPath);

  if (!hasCodeImportDeclaration && !hasDynamicImportCode) {
    return source;
  }

  if (hasCodeImportDeclaration) {
    [
      {
        fromImportName: importsMapping.oldImports.Code,
        toImportName: importsMapping.newImports.Code,
      },
      {
        fromImportName: importsMapping.oldImports.CodeBlock,
        toImportName: importsMapping.newImports.CodeBlock,
      },
    ].forEach(({ fromImportName, toImportName }) => {
      renameNamedImports(j, collection, {
        fromImportName,
        toImportName,
      });
    });
  }

  if (hasDynamicImportCode) {
    addPromiseThenIdentifier(j, collection);
  }

  return collection.toSource(options.printOptions || { quote: 'single' });
}
