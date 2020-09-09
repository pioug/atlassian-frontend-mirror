/* 
WIP This codemod was build during shipit it's changes should be carefully scrutinized before shipping ;)
*/

const themeIndexImports = [
  'themed',
  'withTheme',
  'AtlaskitThemeProvider',
  'getTheme',
  'createTheme',
  'GlobalThemeTokens',
  'ThemeProp',
];

const typesImports = [
  'colorPaletteType',
  'Elevation',
  'ThemeModes',
  'Theme',
  'GlobalThemeTokens',
  'ThemeProps',
  'CustomThemeProps',
  'AtlaskitThemeProps',
  'NoThemeProps',
  'DefaultValue',
  'ThemedValue',
];

const constants = [
  'gridSize',
  'FLATTENED',
  'CHANNEL',
  'DEFAULT_THEME_MODE',
  'THEME_MODES',
  'borderRadius',
  'gridSize',
  'fontSize',
  'fontSizeSmall',
  'fontFamily',
  'codeFontFamily',
  'focusRing',
  'noFocusRing',
  'layers',
  'assistive',
  'visuallyHidden',
];

const akTheme = '@atlaskit/theme';

const constantsPredicate = (specifier: any) =>
  !specifier ||
  !specifier.imported ||
  constants.indexOf(specifier.imported.name) > -1;

const typesPredicate = (specifier: any) =>
  !specifier ||
  !specifier.imported ||
  typesImports.indexOf(specifier.imported.name) > -1;

function getConstantsImport(j: any, path: any) {
  const constantsSpecifierspath = path.value.specifiers.filter(
    constantsPredicate,
  );

  if (constantsSpecifierspath.length === 0) {
    return null;
  }

  return j.importDeclaration(
    constantsSpecifierspath,
    j.literal(`${akTheme}/constants`),
  );
}
const indexPredicate = (specifier: any) =>
  !specifier ||
  !specifier.imported ||
  themeIndexImports.indexOf(specifier.imported.name) > -1;

function getIndexImport(j: any, path: any) {
  const mainIndexSpecifierspath = path.value.specifiers.filter(indexPredicate);

  if (mainIndexSpecifierspath.length === 0) {
    return null;
  }

  return j.importDeclaration(
    mainIndexSpecifierspath,
    j.literal(`${akTheme}/components`),
  );
}

function getUsesOfImport(j: any, fileSource: any, importVarname: any) {
  return fileSource
    .find(j.MemberExpression)
    .filter((spec: any) => spec.value.object.name === importVarname);
}

function getTypesImport(j: any, path: any) {
  const typesSpecifiersPath = path.value.specifiers.filter(typesPredicate);

  if (typesSpecifiersPath.length === 0) {
    return null;
  }

  return j.importDeclaration(
    typesSpecifiersPath,
    j.literal(`${akTheme}/types`),
  );
}

function getOtherImports(j: any, path: any, fileSource: any) {
  return path.value.specifiers
    .filter(
      (specifier: any) =>
        !indexPredicate(specifier) &&
        !constantsPredicate(specifier) &&
        !typesPredicate(specifier),
    )
    .map((specifier: any) => {
      const usesOfImport = getUsesOfImport(j, fileSource, specifier.local.name);

      if (usesOfImport.size() > 0 && usesOfImport.size() < 7) {
        const importSpecifiers: any[] = [];
        const names: any[] = [];

        usesOfImport.forEach((lowerPath: any) => {
          // Make stupid lint rule happy
          const propertyName = lowerPath.value.property.name;
          if (!names.includes(propertyName)) {
            names.push(propertyName);
          }

          j(lowerPath).replaceWith(j.identifier(lowerPath.value.property.name));
        });

        names.forEach(name => {
          importSpecifiers.push(j.importSpecifier(j.identifier(name)));
        });

        return j.importDeclaration(
          importSpecifiers,
          j.literal(`${akTheme}/${specifier.imported.name}`),
        );
      }

      return j.importDeclaration(
        [j.importNamespaceSpecifier(j.identifier(specifier.local.name))],
        j.literal(`${akTheme}/${specifier.imported.name}`),
      );
    });
}

export default function transformer(file: any, api: any) {
  const j = api.jscodeshift;
  const fileSource = j(file.source);

  // Fixup imports
  fileSource
    .find(j.ImportDeclaration)
    .filter((path: any) => path.node.source.value === akTheme)
    .forEach((path: any) => {
      const otherImports = getOtherImports(j, path, fileSource);
      const [firstImport, ...importsAfter] = [
        getIndexImport(j, path),
        getConstantsImport(j, path),
        getTypesImport(j, path),
        ...otherImports,
      ].filter(importStat => importStat);

      if (!firstImport) {
        return;
      }

      firstImport.comments = path.value.comments;

      j(path).replaceWith(firstImport).insertAfter(importsAfter);
    });

  return fileSource.toSource();
}
