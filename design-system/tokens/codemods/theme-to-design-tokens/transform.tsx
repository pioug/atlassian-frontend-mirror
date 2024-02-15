/* eslint-disable no-console */
import { hasImportDeclaration, isDecendantOfType } from '@hypermod/utils';
import type {
  API,
  Collection,
  FileInfo,
  JSCodeshift,
  TemplateElement,
} from 'jscodeshift';

import CSSTransformer from '../css-to-design-tokens/transform';
import { activeTokens } from '../utils/tokens';

import { isDecendantOfToken, isParentOfToken } from './utils/ast';
import { cleanMeta, getMetaFromAncestors } from './utils/ast-meta';
import {
  includesHardCodedColor,
  isBoldColor,
  isHardCodedColor,
  isLegacyColor,
  isLegacyNamedColor,
} from './utils/color';
import {
  containsReplaceableCSSDeclarations,
  findEndIndexOfCSSExpression,
} from './utils/css-utils';
import Search from './utils/fuzzy-search';
import { legacyColorMetaMap } from './utils/legacy-colors';
import {
  findFirstNonspaceIndexAfter,
  kebabize,
  splitAtIndex,
} from './utils/string-utils';

function insertTokenImport(j: JSCodeshift, source: Collection<any>) {
  if (hasImportDeclaration(j, source, '@atlaskit/tokens')) {
    return;
  }

  const newImport = j.importDeclaration(
    [j.importSpecifier(j.identifier('token'))],
    j.stringLiteral('@atlaskit/tokens'),
  );

  source.get().node.program.body.unshift(newImport);
}

function buildToken(j: JSCodeshift, tokenId: string, node: any) {
  const callExpr = j.callExpression(
    j.identifier('token'),
    [j.stringLiteral(tokenId), node].filter(Boolean),
  );

  return callExpr;
}

// Wrap over the j.templateElement builder to provide a more convenient API.
function buildTemplateElement(
  j: JSCodeshift,
  text: string,
  options: { tail?: boolean; fromNode?: TemplateElement | null } = {
    tail: false,
    fromNode: null,
  },
) {
  let tail;
  if (options.fromNode) {
    tail = options.fromNode.tail;
  } else {
    tail = !!options.tail;
  }

  return j.templateElement({ raw: text, cooked: null }, tail);
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
  j: JSCodeshift,
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
  let possibleTokens = activeTokens;

  if (property === 'text') {
    possibleTokens = activeTokens.filter((token) => token.includes('.text'));

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
    possibleTokens = activeTokens.filter(
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
    possibleTokens = activeTokens.filter((token) => token.includes('.icon'));

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
  if (lastColonIndex === -1) {
    return { colonIndex: null, cssPropertyName: null };
  }

  const propertyNameEndIndex = Math.max(
    cssString.lastIndexOf(';', lastColonIndex),
    cssString.lastIndexOf(' ', lastColonIndex),
    -1,
  );

  const startIndex = propertyNameEndIndex + 1;
  return {
    cssPropertyName: cssString.slice(startIndex, lastColonIndex).trim(),
    colonIndex: lastColonIndex,
  };
}

export default async function transformer(
  file: FileInfo,
  api: API,
  debug = false,
) {
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

  // Strings
  source.find(j.StringLiteral).forEach((path) => {
    j(path)
      .filter(
        (expression) => !isDecendantOfType(j, expression, j.ObjectExpression),
      )
      .forEach((path) => {
        const value = path.value.value;

        if (replaceStringLiteralIfItConsistsOnlyOfColor(j, path, value)) {
          transformed = true;
        }
      });
  });

  const templateLiteralPaths = source.find(j.TemplateLiteral).paths();

  for (const path of templateLiteralPaths) {
    // Background: a 'type: TemplateLiteral' Node has quasis and expressions
    // (see ast-types/src/gen/namedTypes.ts), and invariant holds that
    // quasis.length === expression.length + 1.
    //
    // eg `${foo}bar` has quasis [Node(''), Node('bar')] and expressions
    // [Node('foo')]. Each quasi has type: 'TemplateElement'; expressions are
    // probably safe to treat as subtypes of Expression, though ast-types
    // codebase has a more involved definition.
    if (path.value.expressions.length === 0) {
      // A single-quasi (equivalently, no-expression) template literal is
      // basically just a string literal, possibly multi-line. We handle the
      // simple `#ababab` case here, and the multi-line case after.
      const text = path.value.quasis[0].value.raw;

      if (replaceStringLiteralIfItConsistsOnlyOfColor(j, path, text)) {
        transformed = true;
      }
    } else {
      j(path)
        .find(j.Expression)
        .filter((expressionPath) => {
          // jscodeshift walks over the whole tree; we are interested only in
          // the direct children: i.e. top-level expressions appearing in ${}.
          return expressionPath.parent === path;
        })
        .forEach((expressionPath, expressionIndex) => {
          if (
            replaceTemplateLiteralExpression(
              j,
              path,
              expressionPath,
              expressionIndex,
            )
          ) {
            transformed = true;
          }
        });
    }

    // No matter if we have one big quasi or many small chunks between
    // expressions (which potentially have been transformed), try to pass them
    // through the CSS transformer; it's robust enough to understand malformed
    // CSS that would result if we split e.g. this template:
    //
    // `${gridSize}px; color: red;`, giving `px; color: red;` as input; or
    // `@media ${mobile} { color: red }`, giving `{ color: red }`.
    const quasiPaths = j(path)
      .find(j.TemplateElement)
      .filter((quasiPath) => {
        return quasiPath.parent === path;
      })
      .paths();

    for (const quasiPath of quasiPaths) {
      const text = quasiPath.value.value.raw;
      if (
        includesHardCodedColor(text) &&
        containsReplaceableCSSDeclarations(text)
      ) {
        const newCSS = await CSSTransformer(text);

        j(quasiPath).replaceWith(buildTemplateElement(j, newCSS));
        transformed = true;
      }
    }
  }

  function replaceStringLiteralIfItConsistsOnlyOfColor(
    j: any,
    path: any,
    value: string,
  ) {
    if (isDecendantOfToken(j, path)) {
      return false;
    }

    if (
      isHardCodedColor(value) &&
      !isLegacyColor(value) &&
      !isLegacyNamedColor(value)
    ) {
      const parent = path.parent.value;
      let key = '';

      if (parent.type === 'VariableDeclarator') {
        key = parent.id.name;
      }

      const tokenId = getTokenFromNode(j, path, value, key);

      insertTokenImport(j, source);

      j(path).replaceWith(buildToken(j, tokenId, path.value));

      return true;
    }

    return false;
  }

  function replaceTemplateLiteralExpression(
    j: any,
    mainPath: any,
    expressionPath: any,
    expressionIndex: any,
  ) {
    const expression = expressionPath.value;
    if (
      !(
        expression.type === 'MemberExpression' ||
        expression.type === 'Identifier'
      )
    ) {
      return false;
    }

    if (isDecendantOfToken(j, expressionPath)) {
      return false;
    }

    const value = getColorFromIdentifier(expression);

    if (
      !value ||
      (!includesHardCodedColor(value) &&
        !isHardCodedColor(value) &&
        !isLegacyColor(value) &&
        !isLegacyNamedColor(value))
    ) {
      return false;
    }

    const precedingQuasi = mainPath.value.quasis[expressionIndex];
    const precedingQuasiText = precedingQuasi.value.raw;
    const { cssPropertyName, colonIndex } =
      parseCSSPropertyName(precedingQuasiText);

    if (!cssPropertyName) {
      return false;
    }

    const tokenId = getTokenFromNode(j, expressionPath, value, cssPropertyName);

    insertTokenImport(j, source);

    const newQuasis = [...mainPath.value.quasis];
    const newExpressions = [...mainPath.value.expressions];

    if (cssPropertyName !== 'box-shadow') {
      const tokenExpression = buildToken(j, tokenId, expressionPath.value);

      newExpressions[expressionIndex] = tokenExpression;
    } else {
      // box-shadow is a multi-part property where the color can appear at any
      // part position (even though the standard suggests that color comes
      // last, browsers' CSS parsers are more lax). If we get here, then the
      // color part is replaceable.  Textually, it's something like:
      //
      // <rules before>; box-shadow: 0 1px ${colors.N50} 2rem; <rules after>
      //
      // the fallback value will be multipart, i.e. the token call is
      //
      // token(<replacedValue>, `0 1px ${colors.N50} 2rem`)
      //
      // and it's wrapped in a substitution like this:
      //
      // <rules before>; box-shadow: ${token(<...>)}; <rules after>
      //
      // We stich the fallback from the last part of preceding quasi (after
      // colon) and the first part of the following quasi (before ';' or '}').
      //
      // If multiple box-shadows are comma-separated but only one of them has a
      // replaceable color and others are hard-coded, this logic would still
      // work. When multiple shadows have expressions, it's unfortunately not
      // possible to proceed because we cannot find where the value ends from a
      // single following quasi.
      const valueStartIndex = findFirstNonspaceIndexAfter(
        precedingQuasiText,
        colonIndex,
      );

      const [newPrecedingQuasiText, partialValueBeginning] = splitAtIndex(
        precedingQuasiText,
        valueStartIndex,
      );

      const followingQuasi = mainPath.value.quasis[expressionIndex + 1];
      const followingQuasiText = followingQuasi.value.raw;

      const valueEndIndex = findEndIndexOfCSSExpression(
        followingQuasiText,
        followingQuasi.tail,
      );
      if (!valueEndIndex) {
        console.warn(
          'cannot find end of box-shadow value, please check manually',
        );
        return false;
      }
      const [partialValueEnd, newFollowingQuasiText] = splitAtIndex(
        followingQuasiText,
        valueEndIndex + 1,
      );

      const internalQuasis = [
        buildTemplateElement(j, partialValueBeginning, { tail: false }),
        buildTemplateElement(j, partialValueEnd, { tail: true }),
      ];
      const internalExpressions = [expressionPath.value];
      const newFallback = j.templateLiteral(
        internalQuasis,
        internalExpressions,
      );
      const newExpression = buildToken(j, tokenId, newFallback);

      newQuasis[expressionIndex] = buildTemplateElement(
        j,
        newPrecedingQuasiText,
        { fromNode: newQuasis[expressionIndex] },
      );
      newExpressions[expressionIndex] = newExpression;
      newQuasis[expressionIndex + 1] = buildTemplateElement(
        j,
        newFollowingQuasiText,
        { fromNode: newQuasis[expressionIndex] },
      );
    }
    mainPath.replace(j.templateLiteral(newQuasis, newExpressions));
    return true;
  }

  return transformed ? source.toSource() : file.source;
}
