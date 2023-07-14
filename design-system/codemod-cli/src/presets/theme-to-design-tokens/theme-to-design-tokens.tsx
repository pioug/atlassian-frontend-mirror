/* eslint-disable no-console */
import core, { API, Collection, FileInfo } from 'jscodeshift';
import { isDecendantOfType, hasImportDeclaration } from '@codeshift/utils';
import { isDecendantOfToken, isParentOfToken } from './utils/ast';
import { cleanMeta, getMetaFromAncestors } from './utils/ast-meta';
import {
  includesHardCodedColor,
  isHardCodedColor,
  isLegacyColor,
  isLegacyNamedColor,
} from './utils/color';
import Search from './utils/fuzzy-search';
import { legacyColorMetaMap } from './utils/legacy-colors';
import { tokens } from './utils/tokens';

const kebabize = (str: string) =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? '-' : '') + $.toLowerCase(),
  );

function isBoldColor(color: string) {
  const number = parseInt(color.replace(/^./, ''), 10);
  return number > 300;
}

function insertTokenImport(j: core.JSCodeshift, source: Collection<any>) {
  if (hasImportDeclaration(j, source, '@atlaskit/tokens')) {
    return;
  }

  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('token'))],
    j.stringLiteral('@atlaskit/tokens'),
  );

  source.get().node.program.body.unshift(newImport);
}

function buildToken(j: core.JSCodeshift, tokenId: string, node: any) {
  const callExpr = j.callExpression(
    j.identifier('token'),
    [j.stringLiteral(tokenId), node].filter(Boolean),
  );

  return callExpr;
}

function getColorFromIdentifier(expression: any) {
  let value = '';

  if (expression.type === 'Identifier') {
    value = expression.name;
  }

  if (expression.type === 'StringLiteral') {
    value = expression.value;
  }

  if (
    expression.type === 'MemberExpression' &&
    expression.object.name === 'colors' &&
    isLegacyColor(expression.property.name)
  ) {
    value = expression.property.name;
  }

  return value;
}

function getTokenFromNode(
  j: core.JSCodeshift,
  path: any,
  value: string,
  propertyName: string,
): string {
  const valueMeta = cleanMeta(legacyColorMetaMap[value!] || []);
  const ancestorMeta = cleanMeta(
    [...getMetaFromAncestors(j, path), ...kebabize(propertyName).split('-')] ||
      [],
  );

  let property = cleanMeta([kebabize(propertyName)])[0];

  // Attempt to find a property from ancestors if one is not found
  if (
    !property ||
    !['border', 'icon', 'background', 'text'].includes(property)
  ) {
    if (ancestorMeta.includes('border')) {
      property = 'border';
    }

    if (ancestorMeta.includes('icon')) {
      property = 'icon';
    }

    if (ancestorMeta.includes('background')) {
      property = 'background';
    }

    if (ancestorMeta.includes('color')) {
      property = 'text';
    }
  }

  let meta: string[] = [];
  let possibleTokens = tokens;

  if (property === 'text') {
    possibleTokens = tokens.filter((token) => token.includes('.text'));

    if (valueMeta.includes('neutral')) {
      meta.push('color', 'text');
    }

    if (
      valueMeta.includes('neutral') &&
      (value === 'N400' || value === 'N500')
    ) {
      meta.push('color', 'text', 'subtle');
    }

    if (
      valueMeta.includes('neutral') &&
      (value === 'N80' ||
        value === 'N100' ||
        value === 'N200' ||
        value === 'N300' ||
        value === 'N400')
    ) {
      meta.push('color', 'text', 'subtlest');
    }

    // handle non-neutrals
    if (!valueMeta.includes('neutral')) {
      meta.push('color', ...ancestorMeta, ...valueMeta);
    }
  }

  if (property === 'background' || property === 'background-color') {
    if (ancestorMeta.includes('disabled')) {
      // disabled backgrounds
      meta.push(property, ...ancestorMeta);
    } else if (
      // Surfaces
      valueMeta.includes('neutral') &&
      value !== 'N100' &&
      value !== 'N200' &&
      value !== 'N300' &&
      value !== 'N400' &&
      value !== 'N500' &&
      value !== 'N600' &&
      value !== 'N700' &&
      value !== 'N800'
    ) {
      meta.push('surface', ...ancestorMeta);
    } else if (value.includes('N0')) {
      // default surface
      meta.push('elevation', 'surface');
    } else if (valueMeta.includes('neutral') && isBoldColor(value)) {
      // bold netural backgrounds
      meta.push('background', 'neutral', 'bold');
    } else if (valueMeta.includes('neutral')) {
      // netural backgrounds
      meta.push('background', 'neutral');
    }
  }

  if (
    property === 'border' ||
    property === 'border-color' ||
    property === 'border-left' ||
    property === 'border-right' ||
    property === 'border-top' ||
    property === 'border-bottom' ||
    property === 'outline' ||
    property === 'outline-color'
  ) {
    possibleTokens = tokens.filter(
      (token) => token.includes('.border') || token.includes('.focus'),
    );

    if (valueMeta.includes('neutral')) {
      // standard netural boarder
      meta.push('color', 'border', ...ancestorMeta);
    } else {
      meta.push('border', ...valueMeta, ...ancestorMeta);
    }
  }

  if (ancestorMeta.includes('icon')) {
    possibleTokens = tokens.filter((token) => token.includes('.icon'));

    if (ancestorMeta.includes('disabled')) {
      // disabled backgrounds
      meta.push('disabled');
    }

    meta.push('color', 'icon', ...valueMeta);
  }

  // Fallback if guided behavior yields nothing
  if (meta.length === 0) {
    meta.push(property, ...valueMeta, ...ancestorMeta);
  }

  const search = Search(possibleTokens, false);
  const results: [number, string][] = search.get(meta.join(' '));

  let tokenId = ['MISSING_TOKEN'];

  if (results) {
    tokenId = results.map((result) => result[1]) as any;
  }

  return tokenId[0];
}

function parseCSSPropertyName(cssString: string) {
  const lastColonIndex = cssString.lastIndexOf(':');
  const propertyNameEndIndex = Math.max(
    cssString.lastIndexOf(';', lastColonIndex),
    cssString.lastIndexOf(' ', lastColonIndex),
  );

  return cssString.slice(propertyNameEndIndex + 1, lastColonIndex).trim();
}

export default function transformer(file: FileInfo, api: API, debug = false) {
  const j = api.jscodeshift;
  const source = j(file.source);
  let transformed = false;

  // Objects
  source.find(j.ObjectProperty).forEach((path) => {
    if (path.value.value.type === 'ObjectExpression') {
      return;
    }

    // Avoid transforming objects that are default arguments
    if (
      path.parent.parent.value.type === 'ArrowFunctionExpression' ||
      path.parent.parent.value.type === 'FunctionDeclaration'
    ) {
      return;
    }

    if (isParentOfToken(j, path.value.value)) {
      return;
    }

    const value = getColorFromIdentifier(path.value.value);

    if (
      !value ||
      (!includesHardCodedColor(value) &&
        !isHardCodedColor(value) &&
        !isLegacyColor(value) &&
        !isLegacyNamedColor(value))
    ) {
      return;
    }

    let key;

    if (
      path.value.key.type === 'NumericLiteral' ||
      path.value.key.type === 'StringLiteral'
    ) {
      key = path.value.key.value.toString();
    }

    if (path.value.key.type === 'Identifier') {
      key = path.value.key.name;
    }

    // Key is a node type we do not support
    if (!key) {
      return;
    }

    const tokenId = getTokenFromNode(j, path, value, key);

    insertTokenImport(j, source);

    j(path).replaceWith(
      j.objectProperty(
        path.value.key,
        buildToken(j, tokenId, path.value.value),
      ),
    );

    transformed = true;
  });

  // Template literals
  source.find(j.TemplateLiteral).forEach((path) => {
    function replaceTemplateLiteralExpressions(
      j: any,
      expression: any,
      index: number,
    ) {
      if (isDecendantOfToken(j, expression)) {
        return;
      }

      if (index >= path.value.quasis.length) {
        return;
      }

      const quasi = path.value.quasis[index];
      const value = getColorFromIdentifier(expression.value);

      if (
        !value ||
        (!includesHardCodedColor(value) &&
          !isHardCodedColor(value) &&
          !isLegacyColor(value) &&
          !isLegacyNamedColor(value))
      ) {
        return;
      }

      const tokenId = getTokenFromNode(
        j,
        expression,
        value,
        parseCSSPropertyName(quasi.value.cooked || ''),
      );

      insertTokenImport(j, source);

      expression.replace(buildToken(j, tokenId, expression.value));
    }

    j(path)
      .find(j.Identifier)
      .filter(
        (expression) => !isDecendantOfType(j, expression, j.MemberExpression),
      )
      .forEach((expression, i) =>
        replaceTemplateLiteralExpressions(j, expression, i),
      );

    j(path)
      .find(j.MemberExpression)
      .forEach((expression, i) =>
        replaceTemplateLiteralExpressions(j, expression, i),
      );

    transformed = true;
  });

  // JSX props
  source.find(j.JSXAttribute).forEach((path) => {
    if (path.value?.value?.type !== 'JSXExpressionContainer') {
      return;
    }

    if (isParentOfToken(j, path)) {
      return;
    }

    const expression = path.value.value.expression;
    const value = getColorFromIdentifier(expression);

    if (
      !value ||
      (!includesHardCodedColor(value) &&
        !isHardCodedColor(value) &&
        !isLegacyColor(value) &&
        !isLegacyNamedColor(value))
    ) {
      return;
    }

    const tokenId = getTokenFromNode(
      j,
      path,
      value,
      path.value.name.name as string,
    );
    insertTokenImport(j, source);

    j(path)
      .find(j.JSXExpressionContainer)
      .forEach((path) => {
        const tokenNode = buildToken(j, tokenId, path.value.expression);
        j(path).replaceWith(j.jsxExpressionContainer(tokenNode));
      });

    transformed = true;
  });

  return transformed ? source.toSource() : file.source;
}
