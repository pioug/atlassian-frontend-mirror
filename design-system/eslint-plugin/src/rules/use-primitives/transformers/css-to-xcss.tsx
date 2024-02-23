import type { Rule } from 'eslint';
import {
  getIdentifierInParentScope,
  identifier,
  isNodeOfType,
  JSXElement,
  literal,
  ObjectExpression,
  Property,
  SpreadElement,
} from 'eslint-codemod-utils';

import {
  getAttributeValueIdentifier,
  getFunctionArgumentAtPos,
  getJSXAttributeByName,
  getVariableDefinitionValue,
} from '../utils';

export const cssToXcssTransformer = (
  node: JSXElement,
  context: Rule.RuleContext,
  fixer: Rule.RuleFixer,
): (Rule.Fix | undefined)[] => {
  /**
   * Note: The logic here is very similar to the logic in `shouldSuggestBox`. i.e.
   * 1. Find the `css` attr
   * 2. Find the variableName (`myStyles` in `css={myStyles}`)
   * 3. Find the `const myStyles = css({ padding: '8px' })`
   * 4. Find the style object `{ padding: '8px' }`
   *
   * The only difference is, we've already performed very defensive checks for these steps in `shouldSuggestBox`,
   * so there's no need to do those checks here.
   *
   * The repetition could be avoided by combining the 'shouldSuggest' and 'fixCode' steps. However, there are tradeoffs
   * to that approach (mainly poor separation of concerns). I'm un-opinionated about which strategy we use. I just opted
   * for this because the original `use-primitives` rule did this.
   */
  const cssAttr = getJSXAttributeByName(node.openingElement, 'css');
  const cssVariableName = getAttributeValueIdentifier(cssAttr);

  if (!cssVariableName) {
    return [];
  }

  const cssVariableDefinition = getIdentifierInParentScope(
    context.getScope(),
    cssVariableName,
  );

  const cssVariableValue = getVariableDefinitionValue(cssVariableDefinition);

  if (!cssVariableValue) {
    return [];
  }

  const cssObjectExpression = getFunctionArgumentAtPos(cssVariableValue, 0);

  return [
    // Update `css` function name to `xcss`.
    fixer.replaceText(
      cssVariableValue.node.init.callee,
      identifier('xcss').toString(),
    ),
    ...styledObjectToXcssTokens(cssObjectExpression, fixer),
  ];
};

// Update css object values to xcss values
// Note: `properties` in this context is a group of AST nodes that make up a key/value pair in an object.
// e.g. `padding: '8px'`. For clarity, it's renamed to `entry` inside the `.map()`.
export const styledObjectToXcssTokens = (
  styles: ObjectExpression & Partial<Rule.NodeParentExtension>,
  fixer: Rule.RuleFixer,
): (Rule.Fix | undefined)[] => {
  return styles.properties.map((entry: Property | SpreadElement) => {
    if (!isNodeOfType(entry, 'Property')) {
      return;
    }

    if (!isNodeOfType(entry.key, 'Identifier')) {
      return;
    }

    // maps literal values like: 8px to 'space.100'
    if (isNodeOfType(entry.value, 'Literal')) {
      const value = entry.value.value;
      if (typeof value !== 'string') {
        return;
      }

      return fixer.replaceText(
        entry.value,
        literal(`'${supportedStylesMap[entry.key.name][value]}'`).toString(),
      );
    }
    // maps token calls like: token('space.100') to 'space.100'
    if (isNodeOfType(entry.value, 'CallExpression')) {
      const callExpression = entry.value;
      // skip if not a call to `token`
      if (
        !isNodeOfType(callExpression.callee, 'Identifier') ||
        callExpression.callee.name !== 'token' ||
        !isNodeOfType(callExpression.arguments[0], 'Literal')
      ) {
        return;
      }
      // the first argument of `token` is the token name and
      // can be given directly to `xcss` as it has been validated already.
      return fixer.replaceText(
        entry.value,
        literal(`'${callExpression.arguments[0].value}'`).toString(),
      );
    }
  });
};

// TODO: https://product-fabric.atlassian.net/browse/DSP-16054
export const spaceTokenMap: { [key: string]: string } = {
  '0px': 'space.0',
  '2px': 'space.025',
  '4px': 'space.050',
  '6px': 'space.075',
  '8px': 'space.100',
  '12px': 'space.150',
  '16px': 'space.200',
  '20px': 'space.250',
  '24px': 'space.300',
  '32px': 'space.400',
  '40px': 'space.500',
  '48px': 'space.600',
  '64px': 'space.800',
  '80px': 'space.1000',
};

export const dimensionsMap: { [key: string]: string } = {
  '100%': '100%',
};

export const supportedDimensionAttributesMap: {
  [key: string]: typeof spaceTokenMap;
} = {
  width: dimensionsMap,
  height: dimensionsMap,
  minWidth: dimensionsMap,
  minHeight: dimensionsMap,
  maxWidth: dimensionsMap,
  maxHeight: dimensionsMap,
};

export const supportedStylesMap: { [key: string]: typeof spaceTokenMap } = {
  padding: spaceTokenMap,
  paddingBlock: spaceTokenMap,
  paddingBlockEnd: spaceTokenMap,
  paddingBlockStart: spaceTokenMap,
  paddingBottom: spaceTokenMap,
  paddingInline: spaceTokenMap,
  paddingInlineEnd: spaceTokenMap,
  paddingInlineStart: spaceTokenMap,
  paddingLeft: spaceTokenMap,
  paddingRight: spaceTokenMap,
  paddingTop: spaceTokenMap,
  margin: spaceTokenMap,
  marginBlock: spaceTokenMap,
  marginBlockEnd: spaceTokenMap,
  marginBlockStart: spaceTokenMap,
  marginBottom: spaceTokenMap,
  marginInline: spaceTokenMap,
  marginInlineEnd: spaceTokenMap,
  marginInlineStart: spaceTokenMap,
  marginLeft: spaceTokenMap,
  marginRight: spaceTokenMap,
  marginTop: spaceTokenMap,
  ...supportedDimensionAttributesMap,
};
