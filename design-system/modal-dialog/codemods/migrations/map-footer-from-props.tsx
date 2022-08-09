import core, {
  ASTPath,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXSpreadChild,
} from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { getDefaultSpecifier } from '@atlaskit/codemod-utils';

import {
  APPEARANCE_PROP_NAME,
  COMPONENTS_PROP_NAME,
  FOOTER_PROP_NAME,
  PACKAGE_NAME,
} from '../internal/constants';
import {
  getAppearanceFromProp,
  getOverrideFromComponentsProp,
  getOverrideFromIndividualProp,
} from '../internal/utils';

export const mapFooterFromProps = (
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
      const footerFromIndividualProp = getOverrideFromIndividualProp(
        j,
        element,
        FOOTER_PROP_NAME,
      );
      const footerFromComponentsProp = getOverrideFromComponentsProp(
        j,
        element,
        COMPONENTS_PROP_NAME,
        'Footer',
      );

      /**
       * If declared, use the footer passed to the components prop
       * to replicate the logic in the source code (pre-lite mode).
       */
      const footer = footerFromComponentsProp || footerFromIndividualProp;

      if (!footer) {
        return;
      }

      const appearance = getAppearanceFromProp(j, element);
      const props = appearance
        ? [
            j.objectExpression([
              j.objectProperty(j.identifier(APPEARANCE_PROP_NAME), appearance),
            ]),
          ]
        : [];

      appendFooterAsLastChild(
        j,
        element,
        defaultSpecifier,
        j.jsxExpressionContainer(j.callExpression(footer, props)),
      );
    });
};

const appendFooterAsLastChild = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  specifier: string,
  footer: JSXElement | JSXExpressionContainer | JSXFragment | JSXSpreadChild,
) => {
  const children = element.node.children
    ? element.node.children.concat([footer, j.jsxText('\n')])
    : [footer, j.jsxText('\n')];

  j(element)
    .find(j.JSXOpeningElement)
    .forEach((openingElement) => {
      const openingElementName = openingElement.value.name;
      if (
        openingElementName.type === 'JSXIdentifier' &&
        openingElementName.name === specifier
      ) {
        j(element).replaceWith(
          j.jsxElement(
            j.jsxOpeningElement(
              j.jsxIdentifier(specifier),
              openingElement.value.attributes,
            ),
            j.jsxClosingElement(j.jsxIdentifier(specifier)),
            children,
          ),
        );
      }
    });
};
