import type { Scope } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

export const getImportName = (
  scope: Scope.Scope,
  packageName: string,
  componentName: string,
): string | null => {
  let traversingScope: Scope.Scope | null = scope;

  let matchedVariable: Scope.Variable | undefined;
  while (traversingScope && traversingScope.type !== 'global') {
    matchedVariable = traversingScope.variables.find(
      (variable: Scope.Variable) => {
        const def: Scope.Definition = variable.defs?.[0];

        if (
          !def ||
          !def.node ||
          !isNodeOfType(def.node, 'ImportSpecifier') ||
          !def.parent ||
          !isNodeOfType(def.parent, 'ImportDeclaration')
        ) {
          return;
        }

        return (
          def.parent.source.value === packageName &&
          def.node.imported.name === componentName
        );
      },
    );

    if (matchedVariable) {
      break;
    }

    traversingScope = traversingScope.upper;
  }

  if (!matchedVariable) {
    return null;
  } else {
    return matchedVariable.defs[0].node.local.name;
  }
};
