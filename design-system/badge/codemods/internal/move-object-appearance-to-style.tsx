import core, { ASTPath, JSXAttribute, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import {
  APPEARANCE_PROP_NAME,
  BADGE_PACKAGE_NAME,
  STYLE_PROP_NAME,
} from './constants';

export const moveObjectAppearanceToStyle = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, BADGE_PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      getJSXAttributesByName(j, element, APPEARANCE_PROP_NAME).forEach(
        (attribute: ASTPath<JSXAttribute>) => {
          const { value } = attribute.node;
          if (!value) {
            return;
          }

          switch (value.type) {
            case 'JSXExpressionContainer':
              const { expression: appearanceExpression } = value;

              if (appearanceExpression.type === 'ObjectExpression') {
                const styleAttributes = getJSXAttributesByName(
                  j,
                  element,
                  STYLE_PROP_NAME,
                );

                if (styleAttributes.length === 0) {
                  j(element)
                    .find(j.JSXOpeningElement)
                    .forEach((openingElement) => {
                      openingElement.node.attributes?.push(
                        j.jsxAttribute(
                          j.jsxIdentifier(STYLE_PROP_NAME),
                          j.jsxExpressionContainer(
                            getMappedAppearance(j, appearanceExpression),
                          ),
                        ),
                      );
                    });

                  j(attribute).remove();
                }
              }

              break;
          }
        },
      );
    });
};

function getMappedAppearance(
  j: core.JSCodeshift,
  expression: Parameters<typeof j.memberExpression>[0],
) {
  const backgroundColorMemberExpression = j.memberExpression(
    expression,
    j.stringLiteral('backgroundColor'),
  );
  backgroundColorMemberExpression.computed = true;

  const textColorMemberExpression = j.memberExpression(
    expression,
    j.stringLiteral('textColor'),
  );
  textColorMemberExpression.computed = true;

  return j.objectExpression([
    j.objectProperty(
      j.identifier('backgroundColor'),
      backgroundColorMemberExpression,
    ),
    j.objectProperty(j.identifier('color'), textColorMemberExpression),
  ]);
}
