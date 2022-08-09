import core, { ASTPath, JSXAttribute, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

const component = '@atlaskit/tabs';
const fromProp = 'isContentPersisted';
const toProp = 'shouldUnmountTabPanelOnChange';

export const renameIsContentPersistedToShouldUnmountTabPanelOnChange = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, component);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      let foundUsage = false;
      getJSXAttributesByName(j, element, fromProp).forEach(
        (attribute: ASTPath<JSXAttribute>) => {
          foundUsage = true;
          const { value } = attribute.node;

          if (!value) {
            // boolean attribute isContentPersisted -> removed
            return j(attribute).remove();
          }

          if (value.type === 'JSXExpressionContainer') {
            if (value.expression.type === 'BooleanLiteral') {
              if (value.expression.value) {
                // isContentPersisted={true} -> removed
                j(attribute).remove();
              } else {
                // isContentPersisted={false} -> shouldUnmountTabPanelOnChange
                j(attribute).replaceWith(
                  j.jsxAttribute(j.jsxIdentifier(toProp), null),
                );
              }
            } else if (value.expression.type === 'Identifier') {
              // isContentPersisted={isContentPersisted} -> shouldUnmountTabPanelOnChange={!isContentPersisted}
              j(attribute).replaceWith(
                j.jsxAttribute(
                  j.jsxIdentifier(toProp),
                  j.jsxExpressionContainer(
                    j.unaryExpression('!', value.expression),
                  ),
                ),
              );
            }
          }
        },
      );
      if (!foundUsage) {
        // No prop -> shouldUnmountTabPanelOnChange
        // @ts-ignore
        element.value.openingElement.attributes.push(
          j.jsxAttribute(j.jsxIdentifier(toProp), null),
        );
      }
    });
};
