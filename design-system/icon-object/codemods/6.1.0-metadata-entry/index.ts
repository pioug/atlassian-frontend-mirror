import {
  API,
  FileInfo,
  ImportSpecifier,
  ASTPath,
  ImportDefaultSpecifier,
} from 'jscodeshift';
import { tryCreateImport, addToImport } from '../utils';

export const packageName = '@atlaskit/icon-object';

export default function transformer(file: FileInfo, api: API) {
  const j = api.jscodeshift;
  const root = j(file.source, { quote: 'auto' });
  const imports = root.find(j.ImportSpecifier, {
    imported: { name: 'metadata' },
  });
  imports.forEach((p: ASTPath<ImportSpecifier | ImportDefaultSpecifier>) => {
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
  return root.toSource({ quote: 'single' });
}
