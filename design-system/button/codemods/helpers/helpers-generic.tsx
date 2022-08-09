import { NodePath } from 'ast-types/lib/node-path';
import core, {
  ASTPath,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
  JSXAttribute,
  JSXElement,
  Node,
  Program,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export type Nullable<T> = T | null;

export function hasImportDeclaration(
  j: core.JSCodeshift,
  source: string,
  importPath: string,
): boolean {
  return (
    j(source)
      .find(j.ImportDeclaration)
      .filter(
        (path: ASTPath<ImportDeclaration>) =>
          path.node.source.value === importPath,
      ).length > 0
  );
}

export function getDefaultSpecifierName({
  j,
  base,
  packageName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  packageName: string;
}): Nullable<string> {
  const specifiers = base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packageName)
    .find(j.ImportDefaultSpecifier);

  if (!specifiers.length) {
    return null;
  }
  return specifiers.nodes()[0]!.local!.name;
}

export function getJSXAttributesByName({
  j,
  element,
  attributeName,
}: {
  j: core.JSCodeshift;
  element: JSXElement;
  attributeName: string;
}): Collection<JSXAttribute> {
  return j(element)
    .find(j.JSXOpeningElement)
    .find(j.JSXAttribute)
    .filter((attribute) => {
      const matches = j(attribute)
        // This will find identifiers on nested jsx elements
        // so we are going to do a filter to ensure we are only
        // going one level deep
        .find(j.JSXIdentifier)
        .filter((identifer) => {
          j(identifer).closest(j.JSXOpeningElement);
          // Checking we are on the same level as the jsx element
          const closest = j(identifer).closest(j.JSXOpeningElement).nodes()[0];

          if (!closest) {
            return false;
          }
          return (
            closest.name.type === 'JSXIdentifier' &&
            element.openingElement.name.type === 'JSXIdentifier' &&
            element.openingElement.name.name === closest.name.name
          );
        })
        .filter((identifier) => identifier.value.name === attributeName);
      return Boolean(matches.length);
    });
}

export function hasJSXAttributesByName({
  j,
  element,
  attributeName,
}: {
  j: core.JSCodeshift;
  element: JSXElement;
  attributeName: string;
}): boolean {
  return getJSXAttributesByName({ j, element, attributeName }).length > 0;
}

export function removeImport({
  j,
  base,
  packageName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  packageName: string;
}) {
  base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packageName)
    .remove();
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
    base.find(j.Identifier).filter((identifer) => identifer.value.name === name)
      .length > 0
  );
}

export function isUsingSupportedSpread({
  j,
  base,
  element,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  element: NodePath<JSXElement, JSXElement>;
}): boolean {
  const isUsingSpread: boolean =
    j(element).find(j.JSXSpreadAttribute).length > 0;

  if (!isUsingSpread) {
    return true;
  }

  return (
    j(element)
      .find(j.JSXSpreadAttribute)
      .filter((spread) => {
        const argument = spread.value.argument;
        // in place expression is supported
        if (argument.type === 'ObjectExpression') {
          return true;
        }

        // Supporting identifiers that point to an a local object expression
        if (argument.type === 'Identifier') {
          return (
            base.find(j.VariableDeclarator).filter((declarator): boolean => {
              return Boolean(
                declarator.value.id.type === 'Identifier' &&
                  declarator.value.init &&
                  declarator.value.init.type === 'ObjectExpression',
              );
            }).length > 0
          );
        }

        // We don't support anything else
        return false;
      }).length > 0
  );
}

export function isOnlyUsingNameForJSX({
  j,
  base,
  name,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  name: string;
}): boolean {
  const jsxIdentifierCount: number = base
    .find(j.JSXIdentifier)
    .filter((identifier) => identifier.value.name === name).length;

  // Not used in JSX at all
  if (jsxIdentifierCount === 0) {
    return false;
  }

  const nonJSXIdentifierCount: number = base
    .find(j.Identifier)
    .filter((identifier) => {
      if (identifier.value.name !== name) {
        return false;
      }

      // @ts-ignore
      if (identifier.value.type === 'JSXIdentifier') {
        return false;
      }

      // Excluding exports
      if (j(identifier).closest(j.ImportDefaultSpecifier).length) {
        return false;
      }
      if (j(identifier).closest(j.ImportSpecifier).length) {
        return false;
      }

      return true;
    }).length;

  if (nonJSXIdentifierCount > 0) {
    return false;
  }

  return true;
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

export function isUsingThroughSpread({
  j,
  base,
  element,
  propName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  element: NodePath<JSXElement, JSXElement>;
  propName: string;
}): boolean {
  if (!isUsingSupportedSpread({ j, base, element })) {
    return false;
  }

  const isUsedThroughExpression: boolean =
    j(element)
      .find(j.JSXSpreadAttribute)
      .find(j.ObjectExpression)
      .filter((item) => {
        const match: boolean =
          item.value.properties.filter(
            (property) =>
              property.type === 'ObjectProperty' &&
              property.key.type === 'Identifier' &&
              property.key.name === propName,
          ).length > 0;

        return match;
      }).length > 0;

  if (isUsedThroughExpression) {
    return true;
  }

  const isUsedThroughIdentifier: boolean =
    j(element)
      .find(j.JSXSpreadAttribute)
      .find(j.Identifier)
      .filter((identifier): boolean => {
        return (
          base
            .find(j.VariableDeclarator)
            .filter(
              (declarator) =>
                declarator.value.id.type === 'Identifier' &&
                declarator.value.id.name === identifier.value.name,
            )
            .filter((declarator) => {
              const value = declarator.value;
              if (value.id.type !== 'Identifier') {
                return false;
              }

              if (value.id.name !== identifier.value.name) {
                return false;
              }

              if (!value.init) {
                return false;
              }

              if (value.init.type !== 'ObjectExpression') {
                return false;
              }

              const match: boolean =
                value.init.properties.filter(
                  (property) =>
                    property.type === 'ObjectProperty' &&
                    property.key.type === 'Identifier' &&
                    property.key.name === propName,
                ).length > 0;

              return match;
            }).length > 0
        );
      }).length > 0;

  return isUsedThroughIdentifier;
}

export function isUsingProp({
  j,
  base,
  element,
  propName,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  element: NodePath<JSXElement, JSXElement>;
  propName: string;
}): boolean {
  return (
    hasJSXAttributesByName({
      j,
      element: element.value,
      attributeName: propName,
    }) ||
    isUsingThroughSpread({
      j,
      base,
      element,
      propName,
    })
  );
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
  target:
    | Collection<Node>
    | Collection<Program>
    | Collection<ImportDeclaration>;
  message: string;
}) {
  const content: string = ` TODO: (from codemod) ${clean(message)} `;
  target.forEach((path) => {
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

export function shiftDefaultImport({
  j,
  base,
  defaultName,
  oldPackagePath,
  newPackagePath,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  defaultName: string;
  oldPackagePath: string;
  newPackagePath: string;
}) {
  tryCreateImport({
    j,
    base,
    relativeToPackage: oldPackagePath,
    packageName: newPackagePath,
  });

  addToImport({
    j,
    base,
    importSpecifier: j.importDefaultSpecifier(j.identifier(defaultName)),
    packageName: newPackagePath,
  });

  // removing old default specifier
  base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === oldPackagePath)
    .find(j.ImportDefaultSpecifier)
    .remove();
}

type Option =
  | {
      type: 'change-name';
      oldName: string;
      newName: string;
      fallbackNameAlias: string;
    }
  | {
      type: 'keep-name';
      name: string;
      behaviour: 'move-to-default-import' | 'keep-as-named-import';
    };

// try to avoid this one if you can. I'm not super happy with it
export function changeImportFor({
  j,
  base,
  option,
  oldPackagePath,
  newPackagePath,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  option: Option;
  oldPackagePath: string;
  newPackagePath: string;
}) {
  const currentName: string =
    option.type === 'change-name' ? option.oldName : option.name;
  const desiredName: string =
    option.type === 'change-name' ? option.newName : option.name;

  const isUsingName: boolean =
    base
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === oldPackagePath)
      .find(j.ImportSpecifier)
      .find(j.Identifier)
      .filter((identifier) => identifier.value.name === currentName).length > 0;

  if (!isUsingName) {
    return;
  }

  const existingAlias: Nullable<string> =
    base
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === oldPackagePath)
      .find(j.ImportSpecifier)
      .nodes()
      .map(
        (specifier): Nullable<string> => {
          if (specifier.imported.name !== currentName) {
            return null;
          }
          // If aliased: return the alias
          if (specifier.local && specifier.local.name !== currentName) {
            return specifier.local.name;
          }

          return null;
        },
      )
      .filter(Boolean)[0] || null;

  base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === oldPackagePath)
    .find(j.ImportSpecifier)
    .find(j.Identifier)
    .filter((identifier) => {
      if (identifier.value.name === currentName) {
        return true;
      }
      if (identifier.value.name === existingAlias) {
        return true;
      }
      return false;
    })
    .remove();

  // Check to see if need to create new package path
  // Try create an import declaration just before the old import
  tryCreateImport({
    j,
    base,
    relativeToPackage: oldPackagePath,
    packageName: newPackagePath,
  });

  if (option.type === 'keep-name') {
    const newSpecifier: ImportSpecifier | ImportDefaultSpecifier = (() => {
      if (option.behaviour === 'keep-as-named-import') {
        if (existingAlias) {
          return j.importSpecifier(
            j.identifier(desiredName),
            j.identifier(existingAlias),
          );
        }

        return j.importSpecifier(j.identifier(desiredName));
      }

      // moving to default specifier
      return j.importDefaultSpecifier(
        j.identifier(existingAlias || desiredName),
      );
    })();

    // We don't need to touch anything else in the file

    addToImport({
      j,
      base,
      importSpecifier: newSpecifier,
      packageName: newPackagePath,
    });
    return;
  }

  const isNewNameAvailable: boolean =
    base.find(j.Identifier).filter((i) => i.value.name === option.newName)
      .length === 0;

  const newSpecifier: ImportSpecifier = (() => {
    if (existingAlias) {
      return j.importSpecifier(
        j.identifier(desiredName),
        j.identifier(existingAlias),
      );
    }

    if (isNewNameAvailable) {
      return j.importSpecifier(j.identifier(desiredName));
    }

    // new type name is not available: need to use a new alias
    return j.importSpecifier(
      j.identifier(desiredName),
      j.identifier(option.fallbackNameAlias),
    );
  })();

  addToImport({
    j,
    base,
    importSpecifier: newSpecifier,
    packageName: newPackagePath,
  });

  // Change usages of old type in file
  base
    .find(j.Identifier)
    .filter((identifier) => identifier.value.name === option.oldName)
    .replaceWith(
      j.identifier(
        isNewNameAvailable ? option.newName : option.fallbackNameAlias,
      ),
    );
}
