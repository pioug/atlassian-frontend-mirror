import core, {
  API,
  ASTPath,
  FileInfo,
  ImportDeclaration,
  Options,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: Collection<any>,
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

export const createTransformer = (
  packageName: string,
  migrations: { (j: core.JSCodeshift, source: Collection<any>): void }[],
) => (fileInfo: FileInfo, { jscodeshift: j }: API, options: Options) => {
  const source = j(fileInfo.source);

  if (!hasImportDeclaration(j, source, packageName)) {
    return fileInfo.source;
  }

  migrations.forEach((transform) => transform(j, source));

  return source.toSource(options.printOptions || { quote: 'single' });
};

/**
 * Finds import from a particular path/package matching a particular name.
 * Also deals with the case where import is renamed (ie. `import { X as Y } from 'Z';`)
 *
 * @param j
 * @param source The source collection.
 * @param pkg The path or package it came from.
 * @param importName The import identifier.
 * @returns String[] Array of result names which match the specified importName
 */
export const findImportFromPackage = (
  j: core.JSCodeshift,
  source: Collection<any>,
  pkg: string,
  importName: string,
): string[] => {
  // Find regular or renamed imports
  return (
    source
      // find all import statements which import from the given package
      .find(j.ImportDeclaration, {
        source: {
          value: pkg,
        },
      })
      // narrow down to imports related to 'component'
      .filter(
        (importDeclaration) =>
          j(importDeclaration).find(j.ImportSpecifier, {
            imported: {
              type: 'Identifier',
              name: importName,
            },
          }).length > 0,
      )
      .nodes()
      .map((importDeclaration): string => {
        const importSpecifier = j(importDeclaration)
          .find(j.ImportSpecifier, {
            imported: {
              type: 'Identifier',
              name: importName,
            },
          })
          .nodes()[0];

        return importSpecifier.local?.name || '';
      })
      .filter((name) => Boolean(name))
  );
};

/**
 * Renames a variable with the given name.
 *
 * @param from String
 * @param toName String
 */
export const createRenameVariableTransform = (from: string, toName: string) => {
  return (j: core.JSCodeshift, source: Collection<any>) => {
    source.find(j.Identifier, { name: from }).forEach((x) => {
      x.replace(j.identifier(toName));
    });
  };
};
