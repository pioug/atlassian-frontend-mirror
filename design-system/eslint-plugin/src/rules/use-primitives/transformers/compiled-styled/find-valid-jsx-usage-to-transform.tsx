import type { Rule, Scope } from 'eslint';
import {
  isNodeOfType,
  JSXIdentifier,
  JSXOpeningElement,
} from 'eslint-codemod-utils';

/**
 * Given a component name finds its JSX usages and performs some
 * additional validations to ensure transformation can be done correctly
 */
export const findValidJsxUsageToTransform = (
  componentName: string,
  scope: Scope.Scope,
): (JSXOpeningElement & Rule.NodeParentExtension) | undefined => {
  const variableDeclaration = scope.variables.find(
    (v) => v.name === componentName,
  );
  if (!variableDeclaration) {
    return;
  }

  // length here should be exactly 2 to indicate only two references:
  // one being the variable declaration itself
  // second being the JSX call site
  // we might consider handling multiple local JSX call sites in the future
  // but "this is good enough for now"™️
  if (variableDeclaration.references.length !== 2) {
    return;
  }

  const jsxUsage = variableDeclaration.references[1].identifier;
  if (!isNodeOfType(jsxUsage, 'JSXIdentifier')) {
    return;
  }

  const jsxOpeningElement = (
    jsxUsage as JSXIdentifier & Rule.NodeParentExtension
  ).parent;
  // we could relatively easily support some safe attributes like
  // "id" or "testId" but support will be expanded as we go
  if (
    !isNodeOfType(jsxOpeningElement, 'JSXOpeningElement') ||
    jsxOpeningElement.attributes.length > 0
  ) {
    return;
  }

  return jsxOpeningElement;
};
