import type { Collection, JSCodeshift } from 'jscodeshift';

import { getNamedSpecifier, removeImport } from '@atlaskit/codemod-utils';

import { addToImport, tryCreateImport } from './utils';

const AK_THEME_PROVIDER_IDENTIFIER = 'AtlaskitThemeProvider';
const DEPRECATED_THEME_PROVIDER = 'DeprecatedThemeProvider';
const PACKAGE_PATH = '@atlaskit/theme';
const STYLE_COMPONENTS_PATH = 'styled-components';
const ENTRYPOINT_PATH = `${PACKAGE_PATH}/components`;
const DEPRECATED_ENTRYPOINT = `${PACKAGE_PATH}/deprecated-provider-please-do-not-use`;

const cleanUpImports = (
  j: JSCodeshift,
  source: Collection<Node>,
  namedImport: string,
  packagePath: string,
) => {
  const themeImportSpecifiers = source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packagePath)
    .find(j.ImportSpecifier);

  // If AKProvider is the only specifier, we remove the whole import statement.
  // Otherwise we'll just remove the AKProvider specifically.
  if (themeImportSpecifiers.length === 1 && namedImport) {
    removeImport(j, source, packagePath);
  } else {
    themeImportSpecifiers
      .filter(
        (path) => path.node.imported.name === AK_THEME_PROVIDER_IDENTIFIER,
      )
      .remove();
  }
};

export const wrapAkThemeProvider = (
  j: JSCodeshift,
  source: Collection<Node>,
) => {
  const namedImportFromEntrypoint = getNamedSpecifier(
    j,
    source,
    ENTRYPOINT_PATH,
    AK_THEME_PROVIDER_IDENTIFIER,
  );
  const namedImportFromTheme =
    getNamedSpecifier(j, source, PACKAGE_PATH, AK_THEME_PROVIDER_IDENTIFIER) ||
    getNamedSpecifier(j, source, ENTRYPOINT_PATH, AK_THEME_PROVIDER_IDENTIFIER);

  const importSpecifier = namedImportFromEntrypoint || namedImportFromTheme;
  const packagePath = namedImportFromEntrypoint
    ? ENTRYPOINT_PATH
    : PACKAGE_PATH;

  // if we're not importing the AKThemeProvider, no worries
  if (!importSpecifier) {
    return;
  }

  const namedThemeImportFromSC = getNamedSpecifier(
    j,
    source,
    STYLE_COMPONENTS_PATH,
    'ThemeProvider',
  );

  // if we are importing AKThemeProvider, but already using the styled-components theme provider in the file;
  // good chance user is already okay.
  if (namedThemeImportFromSC) {
    return;
  }

  const styledAliasImport = j.identifier('StyledThemeProvider');

  let hasJsxElementsOnPage = false;

  source.findJSXElements(importSpecifier).replaceWith((path) => {
    // set this flag to conditionally import packages required in jsx replace
    hasJsxElementsOnPage = true;

    // check whether it's a self closing element (probs not)
    const selfClose = !path.node.children?.length;

    return j.jsxElement(
      j.jsxOpeningElement(
        j.jsxIdentifier(DEPRECATED_THEME_PROVIDER),
        [
          ...(path.node.openingElement.attributes || []),
          j.jsxAttribute(
            j.jsxIdentifier('provider'),
            j.jsxExpressionContainer(styledAliasImport),
          ),
        ],
        selfClose,
      ),
      !selfClose
        ? j.jsxClosingElement(j.jsxIdentifier(DEPRECATED_THEME_PROVIDER))
        : null,
      !selfClose ? path.node.children : [],
    );
  });

  if (hasJsxElementsOnPage) {
    // if we get here we need to make sure we add the relevant imports
    tryCreateImport(j, source, packagePath, STYLE_COMPONENTS_PATH);
    tryCreateImport(j, source, packagePath, DEPRECATED_ENTRYPOINT);

    // and the new specifiers
    addToImport(
      j,
      source,
      j.importSpecifier(j.identifier('ThemeProvider'), styledAliasImport),
      STYLE_COMPONENTS_PATH,
    );
    addToImport(
      j,
      source,
      j.importDefaultSpecifier(j.identifier(DEPRECATED_THEME_PROVIDER)),
      DEPRECATED_ENTRYPOINT,
    );

    // finally any cleanup required (if any)
    cleanUpImports(j, source, importSpecifier!, packagePath);
  }

  return;
};
