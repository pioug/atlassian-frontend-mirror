import { NodePath } from 'ast-types/lib/node-path';
import core, {
  ASTPath,
  ImportDeclaration,
  JSXAttribute,
  JSXElement,
  Node,
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

export function getSpecifierName({
  j,
  base,
  packageName,
  component,
}: {
  j: core.JSCodeshift;
  base: Collection<any>;
  packageName: string;
  component: string;
}): Nullable<string> {
  const specifiers = base
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packageName)
    .find(j.ImportSpecifier);

  if (!specifiers.length) {
    return null;
  }
  const specifierNode = specifiers
    .nodes()
    .find((node) => node.imported.name === component);
  if (!specifierNode) {
    return null;
  }
  // @ts-ignore
  return specifierNode.local.name;
}

export function getJSXAttributesByName({
  j,
  element,
  attributeName,
}: {
  j: core.JSCodeshift;
  element: JSXElement | ASTPath<JSXElement>;
  attributeName: string;
}): Collection<JSXAttribute> {
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
              return (
                declarator.value.id.type === 'Identifier' &&
                // @ts-ignore
                declarator.value.init.type === 'ObjectExpression'
              );
            }).length > 0
          );
        }

        // We don't support anything else
        return false;
      }).length > 0
  );
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
              // @ts-ignore
              if (value.init.type !== 'ObjectExpression') {
                return false;
              }

              const match: boolean =
                // @ts-ignore
                value.init.properties.filter(
                  // @ts-ignore
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
    // @ts-ignore
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
  target: Collection<Node>;
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

export function updateRenderProps(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
  oldProperty: string,
  newProperty: string,
) {
  source.findJSXElements(specifier).forEach((element: ASTPath<JSXElement>) => {
    j(element)
      .find(j.ArrowFunctionExpression)
      .find(j.ObjectPattern)
      .find(j.ObjectProperty)
      .filter(
        // @ts-ignore
        (path: ASTPath<ObjectProperty>) => path.value.key.name === oldProperty,
      )
      .forEach((path) => {
        j(path).replaceWith(
          j.property(
            'init',
            j.identifier(newProperty),
            j.identifier(oldProperty),
          ),
        );
      });
  });
}
