import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  ImportSpecifier,
  ObjectExpression,
  Options,
  Program,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export type Nullable<T> = T | null;

export function getDefaultSpecifier(
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

export const createRemoveFuncFor = (
  component: string,
  prop: string,
  comment?: string,
) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source.findJSXElements(defaultSpecifier).forEach((element) => {
    getJSXAttributesByName(j, element, prop).forEach((attribute) => {
      j(attribute).remove();
      if (comment) {
        addCommentToStartOfFile({ j, base: source, message: comment });
      }
    });
  });
};

export const flattenCertainChildPropsAsProp = (
  component: string,
  propName: string,
  childProps: string[],
) => (j: core.JSCodeshift, source: Collection<Node>) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);
  if (!defaultSpecifier) {
    return;
  }
  source.findJSXElements(defaultSpecifier).forEach((element) => {
    getJSXAttributesByName(j, element, propName).forEach((attribute) => {
      j(attribute)
        .find(j.JSXExpressionContainer)
        .find(j.ObjectExpression)
        .forEach((objectExpression) => {
          objectExpression.node.properties.forEach((property) => {
            childProps.forEach((childProp) => {
              if (
                property.type === 'ObjectProperty' &&
                property.key.type === 'Identifier' &&
                property.key.name === childProp &&
                element.node.openingElement.attributes
              ) {
                element.node.openingElement.attributes.push(
                  j.jsxAttribute(
                    j.jsxIdentifier(childProp),
                    j.jsxExpressionContainer(
                      property.value as ObjectExpression,
                    ),
                  ),
                );
              }
            });
          });
        });
    });
  });
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
