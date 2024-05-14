import type { SourceCode } from 'eslint';
import type { Scope, Variable } from 'eslint-scope';
import type { Identifier } from 'estree';

export function findVariable({
  identifier,
  sourceCode,
}: {
  identifier: Identifier;
  sourceCode: SourceCode;
}): Variable | null {
  let scope: Scope | null = sourceCode.getScope(identifier);

  while (scope) {
    const variable = scope.set.get(identifier.name);

    if (variable) {
      return variable;
    }

    scope = scope.upper;
  }

  return null;
}
