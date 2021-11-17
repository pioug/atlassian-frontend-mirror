import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export const createRenameImportFor = ({
  componentName,
  newComponentName,
  packagePath,
  isDefaultImport,
}: {
  componentName: string;
  newComponentName: string;
  packagePath: string;
  isDefaultImport: boolean;
}) => (j: core.JSCodeshift, source: Collection<Node>) => {
  source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === packagePath)
    .find(j.ImportSpecifier)
    .filter((path) => path.node.imported.name === componentName)
    .replaceWith((importSpecifier) => {
      const specifier = j.identifier(newComponentName);

      let importAlias;
      if (
        importSpecifier &&
        importSpecifier.node &&
        importSpecifier.node.local
      ) {
        importAlias =
          importSpecifier.node.local.name !== importSpecifier.node.imported.name
            ? j.identifier(importSpecifier.node.local.name)
            : null;
      }

      return isDefaultImport
        ? j.importDefaultSpecifier(importAlias || specifier)
        : j.importSpecifier(specifier, importAlias);
    });

  return source.toSource();
};
