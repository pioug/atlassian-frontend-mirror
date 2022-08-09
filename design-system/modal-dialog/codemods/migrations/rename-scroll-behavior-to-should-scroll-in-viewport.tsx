import core, {
  ASTPath,
  JSXAttribute,
  JSXElement,
  JSXExpressionContainer,
  StringLiteral,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import { PACKAGE_NAME } from '../internal/constants';

const fromProp = 'scrollBehavior';
const toProp = 'shouldScrollInViewport';

export const renameScrollBehaviorToShouldScrollInViewport = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  const convertToBooleanProp = (
    attribute: ASTPath<JSXAttribute>,
    value: StringLiteral,
  ) => {
    if (value.value === 'outside') {
      // scrollBehavior="outside" -> shouldScrollInViewport
      j(attribute).replaceWith(j.jsxAttribute(j.jsxIdentifier(toProp), null));
    } else {
      // scrollBehavior="inside" and scrollBehavior="inside-wide" -> removed
      j(attribute).remove();
    }
  };

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      getJSXAttributesByName(j, element, fromProp).forEach(
        (attribute: ASTPath<JSXAttribute>) => {
          const { value } = attribute.node;

          if (!value) {
            return;
          }

          if (value.type === 'StringLiteral') {
            convertToBooleanProp(attribute, value);
          } else if (value.type === 'JSXExpressionContainer') {
            const expContainer = value as JSXExpressionContainer;
            if (expContainer.expression.type === 'StringLiteral') {
              convertToBooleanProp(
                attribute,
                value.expression as StringLiteral,
              );
            } else if (expContainer.expression.type !== 'JSXEmptyExpression') {
              // scrollBehavior={scrollBehavior} -> shouldScrollInViewport={scrollBehavior === 'outside'}
              j(attribute).replaceWith(
                j.jsxAttribute(
                  j.jsxIdentifier(toProp),
                  j.jsxExpressionContainer(
                    j.binaryExpression(
                      '===',
                      expContainer.expression,
                      j.stringLiteral('outside'),
                    ),
                  ),
                ),
              );
            }
          }
        },
      );
    });
};
