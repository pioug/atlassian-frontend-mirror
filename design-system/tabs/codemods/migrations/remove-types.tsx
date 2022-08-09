import core, { ASTPath, ImportDeclaration, ImportSpecifier } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

const component = '@atlaskit/tabs/types';
const existingTypes = [
  'TabProps',
  'TabPanelProps',
  'TabsProps',
  'TabListProps',
  'TabAttributesType',
  'TabListAttributesType',
  'TabPanelAttributesType',
  'TabData',
];

export const removeTypes = (j: core.JSCodeshift, source: Collection<Node>) => {
  source
    .find(j.ImportDeclaration)
    .filter(
      (importDeclaration: ASTPath<ImportDeclaration>) =>
        importDeclaration.node.source.value === component,
    )
    .forEach((importDeclaration) => {
      const specifiers = j(importDeclaration)
        .find(j.ImportSpecifier)
        .filter((importSpecifier: ASTPath<ImportSpecifier>) => {
          if (!existingTypes.includes(importSpecifier.node.imported.name)) {
            j(importSpecifier).remove();

            return false;
          }

          return true;
        });

      if (!specifiers.length) {
        j(importDeclaration).remove();
      }
    });
};
