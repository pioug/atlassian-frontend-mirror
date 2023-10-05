import type { Scope } from 'eslint';
import { isNodeOfType, JSXAttribute } from 'eslint-codemod-utils';

import { findIdentifierInParentScope } from '../utils/find-in-parent';

export const getLinkItemImportName = (scope: Scope.Scope): string | null => {
  let traversingScope: Scope.Scope | null = scope;

  let matchedVariable: Scope.Variable | undefined;
  while (traversingScope && traversingScope.type !== 'global') {
    matchedVariable = traversingScope.variables.find(
      (variable: Scope.Variable) => {
        const def: Scope.Definition = variable.defs?.[0];

        if (
          !isNodeOfType(def.node, 'ImportSpecifier') ||
          !def.parent ||
          !isNodeOfType(def.parent, 'ImportDeclaration')
        ) {
          return;
        }

        return (
          def.parent.source.value === '@atlaskit/menu' &&
          def.node.imported.name === 'LinkItem'
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
    return matchedVariable.defs?.[0].node.local.name;
  }
};

export const hrefHasInvalidValue = (
  scope: Scope.Scope,
  href: JSXAttribute | undefined,
): boolean => {
  // If doesn't exist,
  if (!href) {
    return true;
  } else if (href.value) {
    // If it is an invalid literal,
    if (isNodeOfType(href.value, 'Literal') && !href.value.value) {
      return true;
      // If it is an expression with a variable inside
    } else if (
      isNodeOfType(href.value, 'JSXExpressionContainer') &&
      isNodeOfType(href.value.expression, 'Identifier')
    ) {
      // Get value within the variable
      const identifierName = href.value.expression.name;

      const variable: Scope.Variable | null = findIdentifierInParentScope({
        scope,
        identifierName,
      });

      // If the variable can't be found in the parent scope, do not throw as
      // invalid because we can't know what the value actually is.
      if (variable) {
        const defNode = variable.defs[0].node;
        // If it is not an imported variable or it is a local variable and it
        // has an invalid value
        if (!defNode.imported && !defNode.init.value) {
          return true;
        }
      }
    }
  }

  return false;
};
