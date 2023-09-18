import core, {
  API,
  ASTPath,
  FileInfo,
  Identifier,
  ImportDeclaration,
  ImportSpecifier,
  JSXAttribute,
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
): Collection<JSXAttribute> {
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

export const createRemoveFuncFor =
  (component: string, prop: string, comment?: string) =>
  (j: core.JSCodeshift, source: Collection<Node>) => {
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

export const createRemoveImportsFor =
  ({
    importsToRemove,
    packagePath,
    comment,
  }: {
    importsToRemove: string[];
    packagePath: string;
    comment: string;
  }) =>
  (j: core.JSCodeshift, source: Collection<Node>) => {
    const isUsingName: boolean =
      source
        .find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === packagePath).length > 0;
    if (!isUsingName) {
      return;
    }

    const existingAliases: Nullable<string>[] =
      source
        .find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === packagePath)
        .find(j.ImportSpecifier)
        .nodes()
        .map((specifier): Nullable<string> => {
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
        })
        .filter(Boolean) || null;

    // Add comments
    source
      .find(j.ImportDeclaration)
      .filter((path) => path.node.source.value === packagePath)
      .find(j.ImportSpecifier)
      .filter((importSpecifier) => {
        const identifier = j(importSpecifier).find(j.Identifier).get();
        if (
          importsToRemove.includes(identifier.value.name) ||
          existingAliases.includes(identifier.value.name)
        ) {
          addCommentToStartOfFile({ j, base: source, message: comment });
          return true;
        }
        return false;
      })
      .remove();

    // Remove entire import if it is empty
    const isEmptyNamedImport =
      source
        .find(j.ImportDeclaration)
        .filter((path) => path.node.source.value === packagePath)
        .find(j.ImportSpecifier)
        .find(j.Identifier).length === 0;

    if (isEmptyNamedImport) {
      const isEmptyDefaultImport =
        source
          .find(j.ImportDeclaration)
          .filter((path) => path.node.source.value === packagePath)
          .find(j.ImportDefaultSpecifier)
          .find(j.Identifier).length === 0;

      isEmptyDefaultImport
        ? source
            .find(j.ImportDeclaration)
            .filter((path) => path.node.source.value === packagePath)
            .remove()
        : source
            .find(j.ImportDeclaration)
            .filter((path) => path.node.source.value === packagePath)
            .find(j.ImportSpecifier)
            .remove();
    }
  };

export const createRenameJSXFunc =
  (
    packagePath: string,
    from: string,
    to: string,
    fallback: string | undefined = undefined,
  ) =>
  (j: core.JSCodeshift, source: any) => {
    const namedSpecifier = getNamedSpecifier(j, source, packagePath, from);

    const toName = fallback
      ? getSafeImportName({
          j,
          base: source,
          currentDefaultSpecifierName: namedSpecifier,
          desiredName: to,
          fallbackName: fallback,
        })
      : to;

    const existingAlias: Nullable<string> =
      source
        .find(j.ImportDeclaration)
        .filter(
          (path: ASTPath<ImportDeclaration>) =>
            path.node.source.value === packagePath,
        )
        .find(j.ImportSpecifier)
        .nodes()
        .map((specifier: ImportSpecifier): Nullable<string> => {
          if (from !== specifier.imported.name) {
            return null;
          }
          // If aliased: return the alias
          if (specifier.local && from !== specifier.local.name) {
            return specifier.local.name;
          }

          return null;
        })
        .filter(Boolean)[0] || null;

    source
      .find(j.ImportDeclaration)
      .filter(
        (path: ASTPath<ImportDeclaration>) =>
          path.node.source.value === packagePath,
      )
      .find(j.ImportSpecifier)
      .filter((importSpecifier: ImportSpecifier) => {
        const identifier = j(importSpecifier).find(j.Identifier).get();
        if (
          from === identifier.value.name ||
          existingAlias === identifier.value.name
        ) {
          return true;
        }
        return false;
      })
      .replaceWith(
        [
          j.importSpecifier(
            j.identifier(toName),
            existingAlias ? j.identifier(existingAlias) : null,
          ),
        ],
        j.literal(packagePath),
      );
  };

export const createTransformer =
  (
    component: string,
    migrates: { (j: core.JSCodeshift, source: Collection<Node>): void }[],
  ) =>
  (fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) => {
    const source: Collection<Node> = j(fileInfo.source);

    if (!hasImportDeclaration(j, source, component)) {
      return fileInfo.source;
    }

    migrates.forEach((tf) => tf(j, source));

    return source.toSource(options.printOptions || { quote: 'single' });
  };
