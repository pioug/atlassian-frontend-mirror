import type { Rule, Scope } from 'eslint';
import {
  isNodeOfType,
  type JSXIdentifier,
  type JSXOpeningElement,
} from 'eslint-codemod-utils';

const JSX_IDENTIFIER = 'JSXIdentifier';
/**
 * Given a component name finds its JSX usages and performs some
 * additional validations to ensure transformation can be done correctly
 *
 * anyOrder: if true, the order of the references doesn't matter (JSX or style declaration)
 */
export const findValidJsxUsageToTransform = (
  componentName: string,
  scope: Scope.Scope,
  anyOrder: boolean = false,
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

  let jsxUsage = variableDeclaration.references[1]?.identifier;

  if (anyOrder) {
    const [firstIdentifier, secondIdentifier] =
      variableDeclaration.references.map((ref) => ref?.identifier);
    // Check if the first reference is a JSXOpeningElement and the second is not or vice versa
    if (
      isNodeOfType(firstIdentifier, JSX_IDENTIFIER) &&
      !isNodeOfType(secondIdentifier, JSX_IDENTIFIER)
    ) {
      jsxUsage = firstIdentifier;
    } else if (
      isNodeOfType(secondIdentifier, JSX_IDENTIFIER) &&
      !isNodeOfType(firstIdentifier, JSX_IDENTIFIER)
    ) {
      jsxUsage = secondIdentifier;
    } else {
      return;
    }
  }

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
