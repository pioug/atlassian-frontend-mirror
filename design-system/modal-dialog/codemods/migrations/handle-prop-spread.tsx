import core, { ASTPath, Collection, JSXElement } from 'jscodeshift/src/core';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
  getDynamicImportName,
} from '@atlaskit/codemod-utils';

import { PACKAGE_NAME } from '../internal/constants';

const comment = `
This file is spreading props on the ModalDialog component, so we could not
automatically convert this usage to the new API.

The following props have been deprecated as part of moving to a compositional API:

- 'heading' prop has been replaced by ModalHeader and ModalTitle components.
- 'actions' prop has been replaced by ModalFooter component, with Button components from @atlaskit/button.
- 'scrollBehavior' prop has been replaced by 'shouldScrollInViewport', where "outside" from the previous prop maps to true in the new prop.
- 'isHeadingMultiline' prop has been replaced by 'isMultiline' prop on the ModalTitle component.
- 'appearance' prop has been moved to the ModalTitle component. To achieve the feature parity, pass the 'appearance' prop directly to ModalTitle and Button components inside ModalFooter.

Refer to the docs for the new API at https://atlassian.design/components/modal-dialog/examples
to complete the migration and use the new composable components.
`;

export const handlePropSpread = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifierName = getDefaultSpecifier(j, source, PACKAGE_NAME);
  const dynamicImportName = getDynamicImportName(j, source, PACKAGE_NAME);
  const modalDialogComponentName = defaultSpecifierName || dynamicImportName;

  if (!modalDialogComponentName) {
    return;
  }

  if (
    source
      .findJSXElements(modalDialogComponentName)
      .filter((element: ASTPath<JSXElement>) => {
        return (
          j(element).find(j.JSXOpeningElement).at(0).find(j.JSXSpreadAttribute)
            .length > 0
        );
      }).length
  ) {
    addCommentToStartOfFile({ j, base: source, message: comment });
  }
};
