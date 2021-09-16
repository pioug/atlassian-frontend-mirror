import core, { ImportDefaultSpecifier, ImportSpecifier } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export function tryCreateImport(
  j: core.JSCodeshift,
  base: Collection<any>,
  relativeToPackage: string,
  packageName: string,
) {
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

export function addToImport(
  j: core.JSCodeshift,
  base: Collection<any>,
  importSpecifier: ImportSpecifier | ImportDefaultSpecifier,
  packageName: string,
) {
  base
    .find(j.ImportDeclaration)
    .filter((path) => path.value.source.value === packageName)
    .forEach((declaration) => {
      // DefaultSpecifiers are a special case
      if (importSpecifier.type === 'ImportDefaultSpecifier') {
        j(declaration)
          .find(
            j.ImportDefaultSpecifier,
            { local: { name: importSpecifier.local?.name } }, // Shorthand find api
          )
          .remove();

        return;
      }

      // Otherwise handle the default case of import specifiers
      j(declaration)
        .find(j.ImportSpecifier, {
          local: { name: importSpecifier.imported.name },
        })
        .remove();
    })
    // replace and clean up declarations
    .replaceWith((declaration) => {
      return j.importDeclaration(
        [
          // filter existing usages if they exist
          ...(declaration.value.specifiers || []),
          importSpecifier,
        ],
        j.literal(packageName),
      );
    });
}
