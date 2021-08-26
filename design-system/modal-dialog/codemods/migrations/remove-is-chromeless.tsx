import core, { Collection } from 'jscodeshift/src/core';

import {
  addCommentBefore,
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import { IS_CHROMELESS_PROP_NAME, PACKAGE_NAME } from '../internal/constants';

const comment = `
ModalDialog has a new compositional API and the 'isChromeless' prop is no longer supported.
To have the functionality of the 'isChromeless' prop, you can choose to not use any of the default exports (ModalBody, ModalHeader and ModalFooter).
The only other change is that ModalDialog's children should have a border radius of 3px to match the box shadow.
For more information, check the documentation at https://atlassian.design/components/modal-dialog/examples`;

export const removeIsChromeless = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  source.findJSXElements(defaultSpecifier).forEach((element) => {
    getJSXAttributesByName(j, element, IS_CHROMELESS_PROP_NAME).forEach(
      (attribute: any) => {
        // if values is true then add comment before removing
        if (
          attribute.node.value === null ||
          (attribute.node.value.expression &&
            attribute.node.value.expression.value !== false)
        ) {
          addCommentBefore(j, j(element), comment);
        }
        j(attribute).remove();
      },
    );
  });
};
