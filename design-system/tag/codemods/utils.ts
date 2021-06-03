import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  JSXAttribute,
  Options,
  StringLiteral,
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

const isEmpty = (string: StringLiteral): boolean =>
  string && string.value !== '';

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

const debug = (component: string) => (j: core.JSCodeshift, source: any) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXAttribute>) => {
      console.log(element); //eslint-disable-line no-console
    });
};

const createRenameFuncFor = (component: string, from: string, to: string) => (
  j: core.JSCodeshift,
  source: any,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXAttribute>) => {
      getJSXAttributesByName(j, element, from).forEach((attribute) => {
        j(attribute).replaceWith(
          j.jsxAttribute(j.jsxIdentifier(to), attribute.node.value),
        );
      });
    });
};

const createConvertFuncFor = (
  component: string,
  from: string,
  to: string,
  predicate?: (value: any) => boolean,
) => (j: core.JSCodeshift, source: any) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXAttribute>) => {
      getJSXAttributesByName(j, element, from).forEach((attribute) => {
        const shouldConvert =
          (predicate && predicate(attribute.node.value)) || false;
        const node = j.jsxAttribute(j.jsxIdentifier(to));
        if (shouldConvert) {
          j(attribute).insertBefore(node);
        }
      });
    });
};

const replaceImportStatementFor = (pkg: string, convertMap: any) => (
  j: core.JSCodeshift,
  root: any,
) => {
  root
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      const defaultSpecifier = (path.value.specifiers || []).filter(
        (specifier) => specifier.type === 'ImportDefaultSpecifier',
      );

      const defaultDeclarations = defaultSpecifier.map((s) => {
        return j.importDeclaration([s], j.literal(convertMap['default']));
      });

      const otherSpecifier = (path.value.specifiers || []).filter(
        (specifier) => specifier.type === 'ImportSpecifier',
      );

      j(path).replaceWith(defaultDeclarations);

      const otherDeclarations = otherSpecifier.map((s) => {
        const localName = s.local!.name;
        if (convertMap[localName]) {
          return j.importDeclaration([s], j.literal(convertMap[localName]));
        } else {
          return j.importDeclaration([s], j.literal(convertMap['*']));
        }
      });

      j(path).insertAfter(otherDeclarations);
    });
};

const createRenameImportFor = (component: string, from: string, to: string) => (
  j: core.JSCodeshift,
  source: any,
) => {
  source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === component,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      j(path).replaceWith(
        j.importDeclaration(path.value.specifiers, j.literal(to)),
      );
    });
};

const createTransformer = (
  component: string,
  migrates: { (j: core.JSCodeshift, source: any): void }[],
) => (fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) => {
  const source = j(fileInfo.source);

  if (!hasImportDeclaration(j, source, component)) {
    return fileInfo.source;
  }

  migrates.forEach((tf) => tf(j, source));

  return source.toSource(options.printOptions);
};

export {
  getDefaultSpecifier,
  getJSXAttributesByName,
  hasImportDeclaration,
  isEmpty,
  createRenameFuncFor,
  createConvertFuncFor,
  createRenameImportFor,
  replaceImportStatementFor,
  createTransformer,
  debug,
};
