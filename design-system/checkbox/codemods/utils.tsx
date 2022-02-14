import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
  Options,
  Program,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export type Nullable<T> = T | null;

export function getNamedSpecifier(
  j: core.JSCodeshift,
  source: any,
  specifier: string,
  importName: string,
) {
  const specifiers = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        path.node.source.value === specifier,
    )
    .find(j.ImportSpecifier)
    .filter(
      (path: ASTPath<ImportSpecifier>) =>
        path.node.imported.name === importName,
    );

  if (!specifiers.length) {
    return null;
  }
  return specifiers.nodes()[0]!.local!.name;
}

export function getJSXAttributesByName(
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

export function hasImportDeclaration(
  j: core.JSCodeshift,
  source: any,
  importPath: string,
) {
  const imports = source
    .find(j.ImportDeclaration)
    .filter(
      (path: ASTPath<ImportDeclaration>) =>
        typeof path.node.source.value === 'string' &&
        path.node.source.value.startsWith(importPath),
    );

  return Boolean(imports.length);
}

export function findIdentifierAndReplaceAttribute(
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

export function hasVariableAssignment(
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

// not replacing newlines (which \s does)
const spacesAndTabs: RegExp = /[ \t]{2,}/g;
const lineStartWithSpaces: RegExp = /^[ \t]*/gm;

function clean(value: string): string {
  return (
    value
      .replace(spacesAndTabs, ' ')
      .replace(lineStartWithSpaces, '')
      // using .trim() to clear the any newlines before the first text and after last text
      .trim()
  );
}

export function addCommentToStartOfFile({
  j,
  base,
  message,
}: {
  j: core.JSCodeshift;
  base: Collection<Node>;
  message: string;
}) {
  addCommentBefore({
    j,
    target: base.find(j.Program),
    message,
  });
}

export function addCommentBefore({
  j,
  target,
  message,
}: {
  j: core.JSCodeshift;
  target: Collection<Program> | Collection<ImportDeclaration>;
  message: string;
}) {
  const content: string = ` TODO: (from codemod) ${clean(message)} `;
  target.forEach((path: ASTPath<Program | ImportDeclaration>) => {
    path.value.comments = path.value.comments || [];

    const exists = path.value.comments.find(
      (comment) => comment.value === content,
    );

    // avoiding duplicates of the same comment
    if (exists) {
      return;
    }

    path.value.comments.push(j.commentBlock(content));
  });
}

export function tryCreateImport({
  j,
  base,
  relativeToPackage,
  packageName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  relativeToPackage: string;
  packageName: string;
}) {
  const exists: boolean =
    base
      .find(j.ImportDeclaration)
      .filter((path) => path.value.source.value === packageName).length > 0;

  if (exists) {
    return;
  }

  base
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === relativeToPackage)
    .insertBefore(j.importDeclaration([], j.literal(packageName)));
}

export function addToImport({
  j,
  base,
  importSpecifier,
  packageName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  importSpecifier: ImportSpecifier | ImportDefaultSpecifier;
  packageName: string;
}) {
  base
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === packageName)
    .replaceWith((declaration) => {
      return j.importDeclaration(
        [
          // we are appending to the existing specifiers
          // We are doing a filter hear because sometimes specifiers can be removed
          // but they hand around in the declaration
          ...(declaration.value.specifiers || []).filter(
            (item) => item.type === 'ImportSpecifier' && item.imported != null,
          ),
          importSpecifier,
        ],
        j.literal(packageName),
      );
    });
}

export const createRenameFuncFor = (
  component: string,
  importName: string,
  from: string,
  to: string,
) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const specifier = getNamedSpecifier(j, source, component, importName);

  if (!specifier) {
    return;
  }

  source.findJSXElements(specifier).forEach((element) => {
    getJSXAttributesByName(j, element, from).forEach((attribute) => {
      j(attribute).replaceWith(
        j.jsxAttribute(j.jsxIdentifier(to), attribute.node.value),
      );
    });
  });

  let variable = hasVariableAssignment(j, source, specifier);
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
    getJSXAttributesByName(j, element, prop).forEach((attribute) => {
      j(attribute).remove();
      if (comment) {
        addCommentToStartOfFile({ j, base: source, message: comment });
      }
    });
  });
};

export const createRenameImportFor = ({
  componentName,
  newComponentName,
  oldPackagePath,
  newPackagePath,
}: {
  componentName: string;
  newComponentName?: string;
  oldPackagePath: string;
  newPackagePath: string;
}) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const isUsingName: boolean =
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === oldPackagePath)
      .find(j.ImportSpecifier)
      .nodes()
      .filter(
        (specifier) =>
          specifier.imported && specifier.imported.name === componentName,
      ).length > 0;
  if (!isUsingName) {
    return;
  }

  const existingAlias: Nullable<string> =
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === oldPackagePath)
      .find(j.ImportSpecifier)
      .nodes()
      .map(
        (specifier): Nullable<string> => {
          if (specifier.imported && specifier.imported.name !== componentName) {
            return null;
          }
          // If aliased: return the alias
          if (specifier.local && specifier.local.name !== componentName) {
            return specifier.local.name;
          }

          return null;
        },
      )
      .filter(Boolean)[0] || null;

  // Check to see if need to create new package path
  // Try create an import declaration just before the old import
  tryCreateImport({
    j,
    base: source,
    relativeToPackage: oldPackagePath,
    packageName: newPackagePath,
  });

  const newSpecifier: ImportSpecifier | ImportDefaultSpecifier = (() => {
    // If there's a new name use that
    if (newComponentName) {
      return j.importSpecifier(
        j.identifier(newComponentName),
        j.identifier(newComponentName),
      );
    }

    if (existingAlias) {
      return j.importSpecifier(
        j.identifier(componentName),
        j.identifier(existingAlias),
      );
    }

    // Add specifier
    return j.importSpecifier(
      j.identifier(componentName),
      j.identifier(componentName),
    );
  })();

  addToImport({
    j,
    base: source,
    importSpecifier: newSpecifier,
    packageName: newPackagePath,
  });

  // Remove old path
  source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === oldPackagePath)
    .remove();
};

export const createRemoveImportsFor = ({
  importsToRemove,
  packagePath,
  comment,
}: {
  importsToRemove: string[];
  packagePath: string;
  comment: string;
}) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const isUsingName: boolean =
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === packagePath).length > 0;
  if (!isUsingName) {
    return;
  }

  const existingAlias: Nullable<string> =
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === packagePath)
      .find(j.ImportSpecifier)
      .nodes()
      .map(
        (specifier): Nullable<string> => {
          if (!importsToRemove.includes(specifier.imported.name)) {
            return null;
          }
          // If aliased: return the alias
          if (
            specifier.local &&
            !importsToRemove.includes(specifier.local.name)
          ) {
            return specifier.local.name;
          }

          return null;
        },
      )
      .filter(Boolean)[0] || null;

  // Remove imports
  source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packagePath)
    .find(j.ImportSpecifier)
    .find(j.Identifier)
    .filter((identifier) => {
      if (
        importsToRemove.includes(identifier.value.name) ||
        identifier.value.name === existingAlias
      ) {
        addCommentToStartOfFile({ j, base: source, message: comment });
        return true;
      }
      return false;
    })
    .remove();

  // Remove entire import if it is empty
  const isEmptyImport =
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === packagePath)
      .find(j.ImportSpecifier)
      .find(j.Identifier).length === 0;
  if (isEmptyImport) {
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === packagePath)
      .remove();
  }
};

export const createTransformer = (
  component: string,
  migrates: { (j: core.JSCodeshift, source: Collection<Node>): void }[],
) => (fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) => {
  const source: Collection<Node> = j(fileInfo.source);

  if (!hasImportDeclaration(j, source, component)) {
    return fileInfo.source;
  }

  migrates.forEach((tf) => tf(j, source));

  return source.toSource(options.printOptions || { quote: 'single' });
};
