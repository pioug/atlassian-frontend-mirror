import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  addCommentToStartOfFile,
  getDefaultSpecifier,
  getJSXAttributesByName,
  hasJSXAttributesByName,
} from '@atlaskit/codemod-utils';

import {
  BODY_PROP_NAME,
  COMPONENTS_PROP_NAME,
  FOOTER_PROP_NAME,
  HEADER_PROP_NAME,
  PACKAGE_NAME,
} from '../internal/constants';

// TODO: Double-check the link to the customization docs after DSP-536 is completed.
const comment = `
We have converted this file as best we could but you might still need
to manually complete migrating this usage of ModalDialog.

This file uses one or more of the following ModalDialog props: 'components', 'header',
'footer', 'body'. These props have been removed as part of moving to
a compositional API.

The render props that used to be exposed by the custom component APIs are
now accessible using the 'useModal' hook instead: 'testId', 'titleId', and 'onClose'.

We are also no longer exposing 'appearance' as render prop, so this needs to be
manually passed to your custom components.

If you are using the 'container' value of 'components' to wrap ModalDialog in something
other than a 'form', you'll need to add the style 'all: inherit;' for scrolling to function.

For a complete guide on customization using the new compositional API, refer to the docs at
https://atlassian.design/components/modal-dialog/examples.
`;

export const removeComponentOverrideProps = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const defaultSpecifier = getDefaultSpecifier(j, source, PACKAGE_NAME);

  if (!defaultSpecifier) {
    return;
  }

  let hasAttributesToRemove;
  const attributeNames = [
    BODY_PROP_NAME,
    COMPONENTS_PROP_NAME,
    FOOTER_PROP_NAME,
    HEADER_PROP_NAME,
  ];

  source.findJSXElements(defaultSpecifier).forEach((element) => {
    hasAttributesToRemove = attributeNames.find((attributeName) =>
      hasJSXAttributesByName(j, element, attributeName),
    );

    attributeNames.forEach((attributeName) =>
      removeAttribute(j, element, attributeName),
    );
  });

  if (hasAttributesToRemove) {
    addCommentToStartOfFile({ j, base: source, message: comment });
  }
};

const removeAttribute = (
  j: core.JSCodeshift,
  element: ASTPath<JSXElement>,
  attributeName: string,
) => {
  getJSXAttributesByName(j, element, attributeName).forEach(
    (attribute: any) => {
      j(attribute).remove();
    },
  );
};
