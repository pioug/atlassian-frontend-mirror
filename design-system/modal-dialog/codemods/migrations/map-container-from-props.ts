import core, { ASTPath, JSXElement, StringLiteral } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { getDefaultSpecifier } from '@atlaskit/codemod-utils';

import { COMPONENTS_PROP_NAME, PACKAGE_NAME } from '../internal/constants';
import {
  getOverrideFromComponentsProp,
  replaceChildren,
} from '../internal/utils';

export const mapContainerFromProps = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      const container = getOverrideFromComponentsProp(
        j,
        element,
        COMPONENTS_PROP_NAME,
        'Container',
      );

      if (!container) {
        return;
      }

      if ((container as StringLiteral).type === 'StringLiteral') {
        const wrappedChildren = j.jsxElement(
          j.jsxOpeningElement(
            j.jsxIdentifier((container as StringLiteral).value),
          ),
          j.jsxClosingElement(
            j.jsxIdentifier((container as StringLiteral).value),
          ),
          element.value.children,
        );

        replaceChildren(j, element, defaultSpecifier, wrappedChildren);

        return;
      } else {
        const props = j.objectExpression([
          j.objectProperty(
            j.identifier('children'),
            j.jsxFragment(
              j.jsxOpeningFragment(),
              j.jsxClosingFragment(),
              element.value.children,
            ),
          ),
        ]);

        replaceChildren(
          j,
          element,
          defaultSpecifier,
          j.jsxExpressionContainer(j.callExpression(container, [props])),
        );

        return;
      }
    });
};
