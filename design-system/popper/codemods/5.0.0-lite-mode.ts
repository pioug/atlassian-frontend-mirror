import core, {
  API,
  ASTPath,
  FileInfo,
  JSXElement,
  JSXExpressionContainer,
  Literal,
  Options,
  StringLiteral,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  messageForModifierProps,
  messageForUsingExpression,
  messageForUsingVariable,
} from './utils/constants';
import {
  addCommentToStartOfFile,
  getJSXAttributesByName,
  getSpecifierName,
  hasImportDeclaration,
  isUsingProp,
  updateRenderProps,
} from './utils/helpers';

const updateOffsetNumbers = (
  value: string,
  j: core.JSCodeshift,
  attribute: ASTPath<any>,
) => {
  if (value.includes(',')) {
    // Split by comma
    const offsetArray: Literal[] = value
      .split(',')
      //@ts-ignore
      .map((elem) => j.literal(parseInt(elem.replace(/\D/g, ''))));
    if (offsetArray.length === 2) {
      j(attribute).replaceWith(
        j.jsxExpressionContainer(j.arrayExpression(offsetArray)),
      );
    }
  } else {
    // Split by space but check if it is a single number
    const offsetArray: Literal[] = value
      .split(' ')
      .filter((elem) => elem.length)
      .map((elem) => j.literal(parseInt(elem.replace(/\D/g, ''))));
    if (offsetArray.length === 2) {
      j(attribute).replaceWith(
        j.jsxExpressionContainer(j.arrayExpression(offsetArray)),
      );
    } else if (offsetArray.length === 1) {
      j(attribute).replaceWith(
        j.jsxExpressionContainer(
          j.arrayExpression([offsetArray[0], j.literal(0)]),
        ),
      );
    }
  }
};

const isJSExpression = (value: string) =>
  value.includes('%') || value.includes('vw') || value.includes('vh');

function updateOffset(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach((path: ASTPath<JSXElement>) => {
    const offsetExpr = getJSXAttributesByName({
      j,
      element: path,
      attributeName: 'offset',
    });

    const stringLiteral = offsetExpr.filter((attr) => {
      return attr.value!.value!.type === 'StringLiteral';
    });

    const expression = offsetExpr.filter((attr) => {
      return attr.value!.value!.type === 'JSXExpressionContainer';
    });

    if (stringLiteral.length > 0) {
      stringLiteral.find(StringLiteral).forEach((attribute) => {
        const expression = attribute.value;
        updateOffsetNumbers(expression.value, j, attribute);
      });
    } else {
      expression.find(JSXExpressionContainer).forEach((attribute) => {
        const expression = attribute.value.expression;
        if (expression.type === 'StringLiteral') {
          const value = expression.value;
          // Not testing for cases like '10 + 10%' because I assume if you're
          // adding or taking numbers it's with units that are not supported
          // and will be picked up by the first case
          if (isJSExpression(value)) {
            addCommentToStartOfFile({
              j,
              base: source,
              message: messageForUsingExpression,
            });
          } else {
            updateOffsetNumbers(value, j, attribute);
          }
        } else if (expression.type === 'NumericLiteral') {
          // If it is a single number convert to [number, 0]
          j(attribute).replaceWith(
            j.jsxExpressionContainer(
              j.arrayExpression([expression, j.literal(0)]),
            ),
          );
        } else if (expression.type === 'Identifier') {
          // If there is a variable add this comment
          addCommentToStartOfFile({
            j,
            base: source,
            message: messageForUsingVariable,
          });
        }
      });
    }
  });
}

function updateModifierProp(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach((element) => {
    if (isUsingProp({ j, base: source, element, propName: 'modifiers' })) {
      addCommentToStartOfFile({
        j,
        base: source,
        message: messageForModifierProps,
      });
    }
  });
}

export default function transformer(
  file: FileInfo,
  { jscodeshift: j }: API,
  options: Options,
) {
  const source = j(file.source);

  // Exit early if not relevant
  // We are doing this so we don't touch the formatting of unrelated files
  if (!hasImportDeclaration(j, file.source, '@atlaskit/popper')) {
    return file.source;
  }

  const specifier = getSpecifierName({
    j,
    base: source,
    packageName: '@atlaskit/popper',
    component: 'Popper',
  });

  if (!specifier) {
    return file.source;
  }

  updateRenderProps(
    j,
    source,
    specifier,
    'outOfBoundaries',
    'isReferenceHidden',
  );
  updateRenderProps(j, source, specifier, 'scheduleUpdate', 'update');
  updateOffset(j, source, specifier);
  updateModifierProp(j, source, specifier);

  // const base: Collection<any> = j(file.source);
  return source.toSource(options.printOptions || { quote: 'single' });
}
