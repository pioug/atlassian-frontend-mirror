import type { Scope } from 'eslint';
import { isNodeOfType } from 'eslint-codemod-utils';

export const getVariableDefinitionValue = (
  variableDefinition: Scope.Variable | null,
): Scope.Definition | undefined => {
  if (!variableDefinition) {
    return undefined;
  }

  if (variableDefinition.defs.length !== 1) {
    return undefined;
  }

  const variableValue = variableDefinition.defs[0];

  // Note: unable to use `isNodeOfType` here
  // because `variableDefinition` is necessarily of type `Scope.Variable`,
  // which doesn't overlap properly with the `eslint-codemod-utils` types
  if (variableValue.type !== 'Variable') {
    return undefined;
  }

  // TODO: is this necessary?
  if (!isNodeOfType(variableValue.node, 'VariableDeclarator')) {
    return undefined;
  }

  return variableValue;
};
