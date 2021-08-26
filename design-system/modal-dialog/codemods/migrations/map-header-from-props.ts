import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { getDefaultSpecifier } from '@atlaskit/codemod-utils';

import {
  APPEARANCE_PROP_NAME,
  COMPONENTS_PROP_NAME,
  HEADER_PROP_NAME,
  PACKAGE_NAME,
} from '../internal/constants';
import {
  getAppearanceFromProp,
  getOverrideFromComponentsProp,
  getOverrideFromIndividualProp,
} from '../internal/utils';

export const mapHeaderFromProps = (
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
      const headerFromIndividualProp = getOverrideFromIndividualProp(
        j,
        element,
        HEADER_PROP_NAME,
      );
      const headerFromComponentsProp = getOverrideFromComponentsProp(
        j,
        element,
        COMPONENTS_PROP_NAME,
        'Header',
      );

      /**
       * If declared, use the header passed to the components prop
       * to replicate the logic in the source code (pre-lite mode).
       */
      const header = headerFromComponentsProp || headerFromIndividualProp;

      if (!header) {
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

      appendHeaderAsFirstChild(
        j,
        element,
        defaultSpecifier,
        j.jsxExpressionContainer(j.callExpression(header, props)),
      );
    });
};

const appendHeaderAsFirstChild = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  specifier: string,
  header: any,
) => {
  const children = element.node.children
    ? [j.jsxText('\n'), header].concat(element.node.children)
    : [j.jsxText('\n'), header];

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
