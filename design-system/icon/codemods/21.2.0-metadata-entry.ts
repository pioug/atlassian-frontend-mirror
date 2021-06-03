import core, {
  API,
  FileInfo,
  ImportSpecifier,
  ASTPath,
  ImportDefaultSpecifier,
  Options,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

export const packageName = '@atlaskit/icon';

export default function transformer(
  file: FileInfo,
  api: API,
  options: Options,
) {
  const j = api.jscodeshift;
  const root = j(file.source, { quote: 'auto' });
  if (hasImportDeclaration(j, root, packageName)) {
    const imports = root.find(j.ImportSpecifier, {
      imported: { name: 'metadata' },
    });
    imports.forEach((p: ASTPath<ImportSpecifier | ImportDefaultSpecifier>) => {
      if (p.parentPath.parentPath.node.source.value !== packageName) {
        return;
      }
      if (p.parentPath.node.specifiers.length === 1) {
        p.node.type = 'ImportDefaultSpecifier';
        p.parentPath.node.source.value = `${packageName}/metadata`;
      } else if (p.node.local) {
        tryCreateImport({
          j,
          base: root,
          packageName: `${packageName}/metadata`,
          relativeToPackage: packageName,
        });
        addToImport({
          j,
          base: root,
          packageName: `${packageName}/metadata`,
          importSpecifier: j.importDefaultSpecifier(
            j.identifier(p.node.local.name),
          ),
        });
        p.replace();
      }
    });
    return root.toSource(options.printOptions || { quote: 'single' });
  }
  return file.source;
}

function hasImportDeclaration(
  j: core.JSCodeshift,
  source: ReturnType<typeof j>,
  importPath: string,
) {
  return !!source
    .find(j.ImportDeclaration)
    .filter((path) => path.node.source.value === importPath).length;
}

function tryCreateImport({
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

function addToImport({
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
