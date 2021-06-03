import core, { ASTPath, ImportDeclaration, ImportSpecifier } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

const component = '@atlaskit/tabs';

export const removeTabItemTabContent = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  source
    .find(j.ImportDeclaration)
    .filter(
      (importDeclaration: ASTPath<ImportDeclaration>) =>
        importDeclaration.node.source.value === component,
    )
    // Tabs only exported TabItem and TabContent from base so remove them
    .forEach((importDeclaration) => {
      j(importDeclaration)
        .find(j.ImportSpecifier)
        .forEach((importSpecifier: ASTPath<ImportSpecifier>) => {
          j(importSpecifier).remove();
        });
    });
};
