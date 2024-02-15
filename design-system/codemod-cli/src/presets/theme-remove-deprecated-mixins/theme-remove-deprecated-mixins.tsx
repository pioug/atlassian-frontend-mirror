import core, { API, Collection, FileInfo } from 'jscodeshift';
import {
  hasImportDeclaration,
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

function buildToken(j: core.JSCodeshift, tokenId: string = '', node: any) {
  const callExpr = tokenId
    ? j.callExpression(
        j.identifier('token'),
        [j.stringLiteral(tokenId), node].filter(Boolean),
      )
    : node;

  return callExpr;
}

function isDecendantOfTokenMethod(j: core.JSCodeshift, path: any): boolean {
  return (
    j(path).closest(j.CallExpression, { callee: { name: 'token' } }).length > 0
  );
}

const isDeprecatedApi = (identifierName: string) =>
  Object.keys(colorReplacements).includes(identifierName);

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

      if (isDynamicReplacement) {
        const token = buildToken(
          j,
          tokenId,
          j.identifier(replacement.importSpecifiers[0]),
        );

        if (isDecendantOfToken) {
          tokenParentNode.replace(token);
          return;
        }

        (isDecendantOfCallExpression ? identifier.parent : identifier).replace(
          token,
        );
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

      if (isDynamicReplacement) {
        const token = buildToken(
          j,
          tokenId,
          j.memberExpression(
            j.identifier(memberExpression.value.object.name),
            j.identifier(replacement.importSpecifiers[0]),
          ),
        );

        if (isDecendantOfToken) {
          tokenParentNode.replace(token);
          return;
        }

        (isDecendantOfCallExpression
          ? memberExpression.parent
          : memberExpression
        ).replace(token);
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
