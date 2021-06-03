import core, {
  API,
  ASTPath,
  FileInfo,
  Identifier,
  ImportDeclaration,
  JSXAttribute,
  Options,
  StringLiteral,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

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

function findIdentifierAndReplaceAttribute(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  identifierName: string,
  searchAttr: string,
  replaceWithAttr: string,
) {
  source
    .find(j.JSXElement)
    .find(j.JSXOpeningElement)
    .filter((path) => {
      return !!j(path.node)
        .find(j.JSXIdentifier)
        .filter((identifier) => identifier.value.name === identifierName);
    })
    .forEach((element) => {
      j(element)
        .find(j.JSXAttribute)
        .find(j.JSXIdentifier)
        .filter((attr) => attr.node.name === searchAttr)
        .forEach((attribute) => {
          j(attribute).replaceWith(j.jsxIdentifier(replaceWithAttr));
        });
    });
}

export function doesIdentifierExist({
  j,
  base,
  name,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  name: string;
}): boolean {
  return (
    base
      .find(j.Identifier)
      .filter((identifer: ASTPath<Identifier>) => identifer.value.name === name)
      .length > 0
  );
}

export function getSafeImportName({
  j,
  base,
  currentDefaultSpecifierName,
  desiredName,
  fallbackName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  currentDefaultSpecifierName: string;
  desiredName: string;
  fallbackName: string;
}) {
  if (currentDefaultSpecifierName === desiredName) {
    return desiredName;
  }

  const isUsed: boolean = doesIdentifierExist({ j, base, name: desiredName });

  return isUsed ? fallbackName : desiredName;
}

export const createRenameJSXFunc = (
  component: string,
  from: string,
  to: string,
  fallback: string | undefined = undefined,
) => (j: core.JSCodeshift, source: any) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  const toName = fallback
    ? getSafeImportName({
        j,
        base: source,
        currentDefaultSpecifierName: defaultSpecifier,
        desiredName: to,
        fallbackName: fallback,
      })
    : to;

  source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === component,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      j(path).replaceWith(
        j.importDeclaration(
          [j.importDefaultSpecifier(j.identifier(toName))],
          j.literal(component),
        ),
      );
    });

  source
    .find(j.JSXElement)
    .find(j.JSXOpeningElement)
    .forEach((path: ASTPath<any>) => {
      return !!j(path.node)
        .find(j.JSXIdentifier)
        .filter((identifier) => identifier.value.name === from)
        .forEach((element) => {
          j(element).replaceWith(j.jsxIdentifier(toName));
        });
    });
};

function hasVariableAssignment(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  identifierName: string,
) {
  const occurance = source.find(j.VariableDeclaration).filter((path) => {
    return !!j(path.node)
      .find(j.VariableDeclarator)
      .find(j.Identifier)
      .filter((identifier) => {
        return identifier.node.name === identifierName;
      }).length;
  });
  return !!occurance.length ? occurance : false;
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

  let variable = hasVariableAssignment(j, source, defaultSpecifier);
  if (variable) {
    variable.find(j.VariableDeclarator).forEach((declarator) => {
      j(declarator)
        .find(j.Identifier)
        .filter((identifier) => identifier.name === 'id')
        .forEach((ids) => {
          findIdentifierAndReplaceAttribute(j, source, ids.node.name, from, to);
        });
    });
  }
};

function hasJSXAttributesByName(
  j: core.JSCodeshift,
  element: ASTPath<any>,
  attributeName: string,
): boolean {
  return getJSXAttributesByName(j, element, attributeName).length > 0;
}

type AddingPorp = {
  prop: string;
  defaultValue: any;
};
const createAddingPropFor = (component: string, options: AddingPorp) => (
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
      const isPropExist = hasJSXAttributesByName(j, element, options.prop);
      if (!isPropExist) {
        const value = j.jsxExpressionContainer(
          j.booleanLiteral(options.defaultValue),
        );
        const node = j.jsxAttribute(j.jsxIdentifier(options.prop), value);
        j(element)
          .find(j.JSXOpeningElement)
          .forEach((e) => {
            if (e.node.attributes) {
              e.node.attributes.push(node);
            }
          });
      }
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

export const elevateComponentToDefault = (
  pkg: string,
  innerElementName: string,
) => (j: core.JSCodeshift, root: any) => {
  root
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) => path.node.source.value === pkg,
    )
    .forEach((path: ASTPath<ImportDeclaration>) => {
      const defaultSpecifier = (path.value.specifiers || []).filter(
        (specifier) => specifier.type === 'ImportDefaultSpecifier',
      );

      const otherSpecifier = (path.value.specifiers || []).filter(
        (specifier) => specifier.type === 'ImportSpecifier',
      );

      if (defaultSpecifier.length > 0) {
        return;
      }

      if (otherSpecifier.length > 1) {
        return;
      }

      const declaration = otherSpecifier.map((s) => {
        return j.importDeclaration(
          [j.importDefaultSpecifier(s.local)],
          j.literal(pkg),
        );
      });

      j(path).replaceWith(declaration);
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

  return source.toSource(options.printOptions || { quote: 'single' });
};

export {
  getDefaultSpecifier,
  getJSXAttributesByName,
  hasImportDeclaration,
  isEmpty,
  createRenameFuncFor,
  createConvertFuncFor,
  createAddingPropFor,
  createRenameImportFor,
  replaceImportStatementFor,
  createTransformer,
  debug,
};
