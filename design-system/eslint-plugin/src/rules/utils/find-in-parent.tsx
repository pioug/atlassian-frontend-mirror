import type { Scope } from 'eslint';

/**
 * This will search first matched identifier in same and parent scopes.
 * Returns first matched identifer otherwise null.
 */
export function findIdentifierInParentScope({
  scope,
  identifierName,
}: {
  scope: Scope.Scope;
  identifierName: string;
}): Scope.Variable | null {
  let traversingScope: Scope.Scope | null = scope;

  while (traversingScope && traversingScope.type !== 'global') {
    const matchedVariable = traversingScope.variables.find(
      (variable) => variable.name === identifierName,
    );

    if (matchedVariable) {
      return matchedVariable;
    }

    traversingScope = traversingScope.upper;
  }

  return null;
}
