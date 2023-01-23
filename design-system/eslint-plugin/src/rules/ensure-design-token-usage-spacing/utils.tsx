import type { Rule, Scope } from 'eslint';
import { CallExpression, EslintNode, isNodeOfType } from 'eslint-codemod-utils';

const typographyProperties = [
  'fontSize',
  'fontWeight',
  'fontFamily',
  'lineHeight',
];

const properties = [
  'padding',
  'paddingBlock',
  'paddingInline',
  'paddingLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'marginLeft',
  'marginTop',
  'marginRight',
  'marginBottom',
  'margin',
  'gap',
  ...typographyProperties,
  // 'width', re-enable later
  // 'height', re-enable later
  'rowGap',
  'gridRowGap',
  'columnGap',
  'gridColumnGap',
];

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

export const isSpacingProperty = (propertyName: string) => {
  return properties.includes(propertyName);
};

export const isTypographyProperty = (propertyName: string) => {
  return typographyProperties.includes(propertyName);
};

export const getValueFromShorthand = (str: unknown): any[] => {
  const valueString = String(str);
  const fontFamily = /(sans-serif$)|(monospace$)/;
  if (fontFamily.test(valueString)) {
    return [valueString];
  }
  // If we want to filter out NaN just add .filter(Boolean)
  return String(str)
    .trim()
    .split(' ')
    .filter((val) => val !== '')
    .map(removePixelSuffix);
};

const isGridSize = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'gridSize' || node.callee.name === 'getGridSize');

const isFontSize = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'fontSize' || node.callee.name === 'getFontSize');

const isFontSizeSmall = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  node.callee.name === 'fontSizeSmall';

const isFontFamily = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'fontFamily' || node.callee.name === 'getFontFamily');

const isCodeFontFamily = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  (node.callee.name === 'codeFontFamily' ||
    node.callee.name === 'getCodeFontFamily');

const isToken = (node: EslintNode): node is CallExpression =>
  isNodeOfType(node, 'CallExpression') &&
  isNodeOfType(node.callee, 'Identifier') &&
  node.callee.name === 'token';

const getValueFromCallExpression = (
  node: EslintNode,
  context: Rule.RuleContext,
) => {
  if (!isNodeOfType(node, 'CallExpression')) {
    return null;
  }

  if (isGridSize(node)) {
    return 8;
  }

  if (isFontSize(node)) {
    return 14;
  }

  if (isFontSizeSmall(node)) {
    return 11;
  }

  if (isFontFamily(node)) {
    return `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
  }

  if (isCodeFontFamily(node)) {
    return `'SFMono-Medium', 'SF Mono', 'Segoe UI Mono', 'Roboto Mono', 'Ubuntu Mono', Menlo, Consolas, Courier, monospace`;
  }

  if (isToken(node)) {
    const args = (node as CallExpression).arguments;
    const call = `\${token(${args
      .map((argNode) => {
        if (isNodeOfType(argNode, 'Literal')) {
          return argNode.raw;
        }

        if (isNodeOfType(argNode, 'Identifier')) {
          return argNode.name;
        }

        if (isNodeOfType(argNode, 'MemberExpression')) {
          return getValue(argNode, context);
        }
      })
      .join(', ')})}`;
    return call;
  }

  return null;
};

export const getValue = (
  node: EslintNode,
  context: Rule.RuleContext,
): string | number | any[] | null | undefined => {
  if (isNodeOfType(node, 'Literal')) {
    return getValueFromShorthand(node.value);
  }

  if (isNodeOfType(node, 'BinaryExpression')) {
    return getValueFromBinaryExpression(node, context);
  }

  if (isNodeOfType(node, 'UnaryExpression')) {
    return getValueFromUnaryExpression(node, context);
  }

  if (isNodeOfType(node, 'CallExpression')) {
    return getValueFromCallExpression(node, context);
  }

  if (isNodeOfType(node, 'Identifier')) {
    return getValueFromIdentifier(node, context);
  }

  if (isNodeOfType(node, 'TemplateLiteral')) {
    return getValueFromTemplateLiteral(node, context);
  }

  return null;
};

const getValueFromIdentifier = (
  node: EslintNode,
  context: Rule.RuleContext,
): number | null | any[] | string | undefined => {
  if (!isNodeOfType(node, 'Identifier')) {
    return null;
  }

  const scope = context.getScope();
  const variable = findIdentifierInParentScope({
    scope,
    identifierName: node.name,
  });

  if (!variable) {
    return null;
  }

  const definition = variable.defs[0];

  if (
    isNodeOfType(definition.node, 'ImportSpecifier') &&
    isNodeOfType(definition.node.parent!, 'ImportDeclaration') &&
    definition.node.parent.source.value ===
      '@atlassian/jira-common-legacy-do-not-add-anything-new/src/styles'
  ) {
    return definition.node.imported.name === 'gridSize' ? 8 : null;
  }

  if (!isNodeOfType(definition.node, 'VariableDeclarator')) {
    return null;
  }

  if (!definition.node.init) {
    return null;
  }

  return getValue(definition.node.init, context);
};

const getValueFromUnaryExpression = (
  node: EslintNode,
  context: Rule.RuleContext,
): number | null => {
  if (!isNodeOfType(node, 'UnaryExpression')) {
    return null;
  }

  const value = getValue(node.argument, context);

  if (!value) {
    return null;
  }

  // eslint-disable-next-line no-eval
  return eval(`${node.operator}(${value})`);
};

/**
 * @example
 * ```js
 * `2 ${variable} 0`
 *
 * // results in [2, NaN, 0]
 * ```
 * ```js
 * const variable = 4;
 * `2 ${variable} 0`
 *
 * // results in [2, 4, 0]
 * ```
 */
const getValueFromTemplateLiteral = (
  node: EslintNode,
  context: Rule.RuleContext,
): number | number[] | string | null => {
  if (!isNodeOfType(node, `TemplateLiteral`)) {
    return null;
  }

  const combinedString = node.quasis
    .map((q, i) => {
      return `${q.value.raw}${
        node.expressions[i] ? getValue(node.expressions[i], context) : ''
      }`;
    })
    .join('')
    .trim();

  const fontFamily = /(sans-serif$)|(monospace$)/;
  if (fontFamily.test(combinedString)) {
    return combinedString;
  }

  return combinedString.split(' ').map(removePixelSuffix) as any[];
};

const getValueFromBinaryExpression = (
  node: EslintNode,
  context: Rule.RuleContext,
): number | null => {
  if (!isNodeOfType(node, 'BinaryExpression')) {
    return null;
  }

  const { left, right, operator } = node;

  const leftValue = getValue(left, context);
  const rightValue = getValue(right, context);
  const final =
    rightValue && leftValue
      ? // eslint-disable-next-line no-eval
        eval(`${leftValue}${operator}${rightValue}`)
      : null;

  return final;
};

const emRegex = /(.*\d+)em$/;

export const emToPixels = <T extends unknown>(
  value: T,
  fontSize: number | null | undefined,
) => {
  if (typeof value === 'string') {
    const match = value.match(emRegex);
    if (match && typeof fontSize === 'number') {
      return Number(match[1]) * fontSize;
    } else {
      return null;
    }
  }
  return value;
};

const percentageOrEm = /(%$)|(\d+em$)/;

export const removePixelSuffix = (value: string | number) => {
  const isString = typeof value === 'string';

  // @ts-ignore This shouldn't be a type error but CI is complaining
  if (isString && percentageOrEm.test(value)) {
    return value;
  }

  // @ts-ignore This shouldn't be a type error but CI is complaining
  return Number(isString ? value.replace('px', '') : value);
};

const invalidSpacingUnitRegex = /(%$)|(\d+rem$)|(^calc)|(vw$)|(vh$)/;

export const isValidSpacingValue = (
  value: string | number | boolean | RegExp | null | undefined | any[] | bigint,
  fontSize?: number | null | undefined,
) => {
  if (typeof value === 'string') {
    if (invalidSpacingUnitRegex.test(value)) {
      return false;
    }
  } else if (Array.isArray(value)) {
    // could be array due to shorthand
    for (const val in value) {
      if (invalidSpacingUnitRegex.test(val)) {
        return false;
      }
    }
  }

  if (emRegex.test(value as string) && typeof fontSize !== 'number') {
    return false;
  }
  return true;
};

// convert line-height to lineHeight
export const convertHyphenatedNameToCamelCase = (prop: string) => {
  return prop.replace(/-./g, (m) => m[1].toUpperCase());
};

/**
 * @param node
 * @returns The furthest parent node that is on the same line as the input node
 */
export const findParentNodeForLine = (node: Rule.Node): Rule.Node => {
  if (!node.parent) {
    return node;
  }
  if (node.loc?.start.line !== node.parent.loc?.start.line) {
    return node;
  } else {
    return findParentNodeForLine(node.parent);
  }
};
