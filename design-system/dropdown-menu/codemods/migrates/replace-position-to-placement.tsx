import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import convertPosition from '../utils/convert-position';

const updatePositionValue = (j: core.JSCodeshift, source: Collection<Node>) => {
  const defaultSpecifier = getDefaultSpecifier(
    j,
    source,
    '@atlaskit/dropdown-menu',
  );

  if (!defaultSpecifier) {
    return;
  }

  source
    .findJSXElements(defaultSpecifier)
    .forEach((element: ASTPath<JSXElement>) => {
      getJSXAttributesByName(j, element, 'position').forEach(
        (attribute: any) => {
          j(attribute).replaceWith(
            j.jsxAttribute(
              j.jsxIdentifier('placement'),
              j.literal(convertPosition(attribute.node.value.value)),
            ),
          );
        },
      );
    });
};

export default updatePositionValue;
