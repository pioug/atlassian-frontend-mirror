import core, { API, Collection, FileInfo } from 'jscodeshift';
import {
  hasImportDeclaration,
  hasImportSpecifier,
  getImportDeclaration,
  insertImportSpecifier,
} from '@codeshift/utils';

import { colorReplacements } from './utils/replacements';

function isDecendantOfType(j: core.JSCodeshift, path: any, type: any) {
  return j(path).closest(type).length > 0;
}

function insertTokenImport(j: core.JSCodeshift, source: Collection<any>) {
  if (hasImportDeclaration(j, source, '@atlaskit/tokens')) {
    return;
  }

  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('token'))],
    j.stringLiteral('@atlaskit/tokens'),
  );

  source.get().node.program.body.unshift(newImport);
}

function insertThemedImport(j: core.JSCodeshift, source: Collection<any>) {
  if (hasImportSpecifier(j, source, 'themed', '@atlaskit/theme/components')) {
    return;
  }

  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('themed'))],
    j.stringLiteral('@atlaskit/theme/components'),
  );

  source.get().node.program.body.unshift(newImport);
}

function buildToken(j: core.JSCodeshift, tokenId: string, node: any) {
  const callExpr = j.callExpression(
    j.identifier('token'),
    [j.stringLiteral(tokenId), node].filter(Boolean),
  );

  return callExpr;
}

function isDecendantOfTokenMethod(j: core.JSCodeshift, path: any): boolean {
  return (
    j(path).closest(j.CallExpression, { callee: { name: 'token' } }).length > 0
  );
}

const isDeprecatedApi = (identifierName: string) =>
  Object.keys(colorReplacements).includes(identifierName);

function buildThemedNode(
  j: core.JSCodeshift,
  tokenId: string = '',
  fallbackLight: any,
  fallbackDark: any,
) {
  return j.callExpression(j.identifier('themed'), [
    j.objectExpression([
      j.objectProperty(
        j.identifier('light'),
        tokenId ? buildToken(j, tokenId, fallbackLight) : fallbackLight,
      ),
      j.objectProperty(
        j.identifier('dark'),
        tokenId ? buildToken(j, tokenId, fallbackDark) : fallbackDark,
      ),
    ]),
  ]);
}

function replaceIdentifiers(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: any,
) {
  const importSpecifierLocal = specifier.value.local!.name;
  const importSpecifierImported = specifier.value.imported!.name;
  source
    .find(j.Identifier, { name: importSpecifierLocal })
    .filter(
      (identifier) => !isDecendantOfType(j, identifier, j.ImportDeclaration),
    )
    .filter((identifier) => identifier.parent.value.type !== 'MemberExpression')
    .filter(
      (identifier) =>
        ![
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'JSXAttribute',
          'JSXOpeningElement',
          'LogicalExpression',
          'ObjectProperty',
          'TSFunctionType',
          'TSPropertySignature',
          'VariableDeclarator',
        ].includes(identifier.parent.value.type),
    )
    .forEach((identifier) => {
      const replacement = colorReplacements[importSpecifierImported];
      const isDecendantOfToken = isDecendantOfTokenMethod(j, identifier);
      const isDecendantOfCallExpression =
        identifier.parent.value.type === 'CallExpression';

      const isDynamicReplacement =
        !isDecendantOfCallExpression ||
        (isDecendantOfCallExpression &&
          identifier.parent.value.arguments.length > 0);

      const tokenParentNode =
        isDecendantOfToken &&
        j(identifier)
          .closest(j.CallExpression, { callee: { name: 'token' } })
          .get();
      const tokenId = isDecendantOfToken
        ? tokenParentNode.value.arguments[0].value
        : replacement.tokenId;

      insertTokenImport(j, source);
      insertImportSpecifier(
        j,
        source,
        j.importSpecifier(j.identifier(replacement.importSpecifiers[0])),
        '@atlaskit/theme/colors',
      );

      // Requires themed function
      if (isDynamicReplacement) {
        const themedNode = buildThemedNode(
          j,
          tokenId,
          j.identifier(replacement.importSpecifiers[0]),
          j.identifier(replacement.importSpecifiers[1]),
        );

        insertThemedImport(j, source);
        insertImportSpecifier(
          j,
          source,
          j.importSpecifier(j.identifier(replacement.importSpecifiers[1])),
          '@atlaskit/theme/colors',
        );

        if (isDecendantOfToken && isDecendantOfCallExpression) {
          const callExpression = identifier.parent;
          tokenParentNode.replace(
            j.callExpression(themedNode, callExpression.value.arguments),
          );
          return;
        }

        if (isDecendantOfToken) {
          tokenParentNode.replace(themedNode);
          return;
        }

        identifier.replace(themedNode);
        return;
      }

      if (!isDecendantOfToken && replacement.tokenId) {
        (isDecendantOfCallExpression ? identifier.parent : identifier).replace(
          buildToken(
            j,
            replacement.tokenId,
            j.identifier(replacement.staticReplacement),
          ),
        );

        return;
      }

      if (replacement.tokenId) {
        (isDecendantOfCallExpression ? identifier.parent : identifier).replace(
          j.identifier(replacement.staticReplacement),
        );

        return;
      }
    });
}

function replaceMemberExpressions(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: any,
) {
  source
    .find(j.MemberExpression, {
      object: { name: specifier.value.local!.name },
    })
    .find(j.Identifier)
    .filter((identifier) => isDeprecatedApi(identifier.value.name))
    .forEach((identifier) => {
      const memberExpression = identifier.parent;
      const replacement = colorReplacements[identifier.value.name];
      const isDecendantOfToken = isDecendantOfTokenMethod(j, identifier);
      const isDecendantOfCallExpression =
        identifier.parent.parent.value.type === 'CallExpression';

      const isDynamicReplacement =
        !isDecendantOfCallExpression ||
        (isDecendantOfCallExpression &&
          identifier.parent.parent.value.arguments.length > 0);

      const tokenParentNode =
        isDecendantOfToken &&
        j(identifier)
          .closest(j.CallExpression, { callee: { name: 'token' } })
          .get();
      const tokenId = isDecendantOfToken
        ? tokenParentNode.value.arguments[0].value
        : replacement.tokenId;

      insertTokenImport(j, source);

      // Requires themed function
      if (isDynamicReplacement) {
        const themedNode = buildThemedNode(
          j,
          tokenId,
          j.memberExpression(
            j.identifier(memberExpression.value.object.name),
            j.identifier(replacement.importSpecifiers[0]),
          ),
          j.memberExpression(
            j.identifier(memberExpression.value.object.name),
            j.identifier(replacement.importSpecifiers[1]),
          ),
        );

        insertThemedImport(j, source);

        if (isDecendantOfToken && isDecendantOfCallExpression) {
          const callExpression = identifier.parent.parent;
          tokenParentNode.replace(
            j.callExpression(themedNode, callExpression.value.arguments),
          );
          return;
        }

        if (isDecendantOfToken) {
          tokenParentNode.replace(themedNode);
          return;
        }

        memberExpression.replace(themedNode);
        return;
      }

      if (!isDecendantOfToken && replacement.tokenId) {
        (isDecendantOfCallExpression
          ? identifier.parent.parent
          : identifier
        ).replace(
          buildToken(
            j,
            replacement.tokenId,
            j.memberExpression(
              j.identifier(memberExpression.value.object.name),
              j.identifier(replacement.staticReplacement),
            ),
          ),
        );

        return;
      }

      if (replacement.tokenId) {
        (isDecendantOfCallExpression
          ? identifier.parent.parent
          : identifier
        ).replace(
          j.memberExpression(
            j.identifier(memberExpression.value.object.name),
            j.identifier(replacement.staticReplacement),
          ),
        );

        return;
      }
    });
}

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const source = j(file.source);

  const hasThemeImport = hasImportDeclaration(j, source, '@atlaskit/theme');
  const hasThemeColorsImport = hasImportDeclaration(
    j,
    source,
    '@atlaskit/theme/colors',
  );

  if (!hasThemeImport && !hasThemeColorsImport) {
    return file.source;
  }

  getImportDeclaration(j, source, '@atlaskit/theme')
    .find(j.ImportNamespaceSpecifier)
    .forEach((specifier) => {
      replaceMemberExpressions(j, source, specifier);
    });

  getImportDeclaration(j, source, '@atlaskit/theme')
    .find(j.ImportSpecifier)
    .forEach((specifier) => {
      replaceMemberExpressions(j, source, specifier);
    });

  getImportDeclaration(j, source, '@atlaskit/theme/colors')
    .find(j.ImportNamespaceSpecifier)
    .forEach((specifier) => {
      replaceMemberExpressions(j, source, specifier);
    });

  getImportDeclaration(j, source, '@atlaskit/theme/colors')
    .find(j.ImportSpecifier)
    .filter((specifier) => isDeprecatedApi(specifier.value.imported.name))
    .forEach((specifier) => {
      replaceIdentifiers(j, source, specifier);
    })
    .remove();

  // Clean-up empty imports
  getImportDeclaration(j, source, '@atlaskit/theme/colors')
    .filter((importDec) => !importDec.value.specifiers?.length)
    .remove();

  getImportDeclaration(j, source, '@atlaskit/theme')
    .filter((importDec) => !importDec.value.specifiers?.length)
    .remove();

  return source.toSource();
}
