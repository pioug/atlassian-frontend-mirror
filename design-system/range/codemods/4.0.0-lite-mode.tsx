import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  JSXAttribute,
  Options,
} from 'jscodeshift';

function getDefaultSpecifier(
  j: core.JSCodeshift,
  source: any,
  specifier: string,
) {
  const specifiers = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === specifier,
    )
    .find(j.ImportDefaultSpecifier);

  if (!specifiers.length) {
    return null;
  }
  return specifiers.nodes()[0]!.local!.name;
}

function getJSXAttributesByName(
  j: core.JSCodeshift,
  element: ASTPath<any>,
  attributeName: string,
) {
  return j(element)
    .find(j.JSXOpeningElement)
    .find(j.JSXAttribute)
    .filter((attribute) => {
      const matches = j(attribute)
        .find(j.JSXIdentifier)
        .filter((identifier) => identifier.value.name === attributeName);
      return Boolean(matches.length);
    });
}

function updateRef(j: core.JSCodeshift, source: any) {
  const defaultSpecifier = getDefaultSpecifier(j, source, '@atlaskit/range');

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXAttribute>) => {
      getJSXAttributesByName(j, element, 'inputRef').forEach((attribute) => {
        j(attribute).replaceWith(
          j.jsxAttribute(j.jsxIdentifier('ref'), attribute.node.value),
        );
      });
    });
}

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: any,
  importPath: string,
) {
  const imports = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === importPath,
    );

  return Boolean(imports.length);
}

export default function transformer(
  fileInfo: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(fileInfo.source);

  if (!hasImportDeclaration(j, source, '@atlaskit/range')) {
    return fileInfo.source;
  }

  updateRef(j, source);

  return source.toSource(options.printOptions || { quote: 'single' });
}
