import core, {
  API,
  ASTPath,
  FileInfo,
  JSXElement,
  JSXExpressionContainer,
  Literal,
  Options,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getJSXAttributesByName,
  getSpecifierName,
  hasImportDeclaration,
  isUsingProp,
  updateRenderProps,
} from './helpers';

function updateOffset(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach((path: ASTPath<JSXElement>) => {
    getJSXAttributesByName({
      j,
      element: path,
      attributeName: 'offset',
    })
      .find(JSXExpressionContainer)
      .forEach(attribute => {
        const expression = attribute.value.expression;
        if (expression.type === 'StringLiteral') {
          const value = expression.value;
          // Not testing for cases like '10 + 10%' because I assume if you're
          // adding or taking numbers it's with units that are not supported
          // and will be picked up by the first case
          if (
            value.includes('%') ||
            value.includes('vw') ||
            value.includes('vh')
          ) {
            addCommentToStartOfFile({
              j,
              base: source,
              message: `
                Popper.js has been upgraded from 1.14.1 to 2.4.2,
                and as a result the offset prop has changed to be an array. e.g '0px 8px' -> [0, 8]
                Along with this change you cannot use vw, vh or % units or addition or multiplication
                Change the offset value to use pixel values
                Further details can be found in the popper docs https://popper.js.org/docs/v2/modifiers/offset/
                `,
            });
          } else if (value.includes(',')) {
            // Split by comma
            const offsetArray: Literal[] = expression.value
              .split(',')
              //@ts-ignore
              .map(elem => j.literal(parseInt(elem.replace(/\D/g, ''))));
            if (offsetArray.length === 2) {
              j(attribute).replaceWith(
                j.jsxExpressionContainer(j.arrayExpression(offsetArray)),
              );
            }
          } else {
            // Split by space but check if it is a single number
            const offsetArray: Literal[] = expression.value
              .split(' ')
              .filter(elem => elem.length)
              .map(elem => j.literal(parseInt(elem.replace(/\D/g, ''))));
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
            message: `
              Popper.js has been upgraded from 1.14.1 to 2.4.2, and as a result the offset
              prop has changed to be an array. e.g '0px 8px' -> [0, 8]
              As you are using a variable, you will have change the offset prop manually
              Further details can be found in the popper docs https://popper.js.org/docs/v2/modifiers/offset/
              `,
          });
        }
      });
  });
}

function updateModifierProp(
  j: core.JSCodeshift,
  source: Collection<any>,
  specifier: string,
) {
  source.findJSXElements(specifier).forEach(element => {
    if (isUsingProp({ j, base: source, element, propName: 'modifiers' })) {
      addCommentToStartOfFile({
        j,
        base: source,
        message: `
          Popper.js has been upgraded from 1.14.1 to 2.4.2,
          and as a result the modifier prop has changed significantly. The format has been
          changed from object of objects, to array of objects, with the key for each modifier
          replaced with a name key:value pair inside the modifier object, and an options:object
          pair for configuration and other changes unique to each modifier.
          Further details can be found in the popper docs: https://popper.js.org/docs/v2/modifiers/
        `,
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
