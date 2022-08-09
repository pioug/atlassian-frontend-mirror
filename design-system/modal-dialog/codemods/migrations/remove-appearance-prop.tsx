import core, { ASTPath, Collection, JSXAttribute } from 'jscodeshift/src/core';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import { APPEARANCE_PROP_NAME, PACKAGE_NAME } from '../internal/constants';

export const removeAppearanceProp = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  source.findJSXElements(defaultSpecifier).forEach((element) => {
    getJSXAttributesByName(j, element, APPEARANCE_PROP_NAME).forEach(
      (attribute: ASTPath<JSXAttribute>) => {
        j(attribute).remove();
      },
    );
  });
};
