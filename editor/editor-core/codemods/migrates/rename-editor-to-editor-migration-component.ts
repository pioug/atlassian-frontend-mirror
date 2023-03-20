import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

/**
 * Generate a codemod to move component from Editor to
 * EditorMigrationComponent
 * Ref: ED-16826
 */
export const createUpdateEditorToMigrationComponent = (
  pkg: string,
  component: string,
) => {
  return (j: core.JSCodeshift, source: Collection<any>) => {
    source
      .find(j.ImportDeclaration, { source: { value: pkg } })
      .filter(
        (path) =>
          j(path).find(j.ImportSpecifier, {
            imported: { type: 'Identifier', name: component },
          }).length > 0,
      )
      .find(j.ImportSpecifier)
      .filter((path) => path.node.imported.name === component)
      .replaceWith((currentImport) =>
        j.importSpecifier(
          j.identifier('EditorMigrationComponent'),
          currentImport.node.local,
        ),
      );
  };
};

export const renameEditorToMigrationComponent =
  createUpdateEditorToMigrationComponent('@atlaskit/editor-core', 'Editor');
