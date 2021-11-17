/* eslint-disable @repo/internal/fs/filename-pattern-match */
import core, { ASTPath, JSXElement } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  getDefaultSpecifier,
  getJSXAttributesByName,
} from '@atlaskit/codemod-utils';

const replaceShouldAllowMultiline = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
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
      getJSXAttributesByName(j, element, 'shouldAllowMultiline').forEach(
        (attribute: any) => {
          const shouldTitleWrap = j.jsxAttribute(
            j.jsxIdentifier('shouldTitleWrap'),
            attribute.node.value,
          );
          const shouldDescriptionWrap = j.jsxAttribute(
            j.jsxIdentifier('shouldDescriptionWrap'),
            attribute.node.value,
          );

          j(attribute).insertBefore(shouldTitleWrap);
          j(attribute).insertBefore(shouldDescriptionWrap);

          j(attribute).remove();
        },
      );
    });
};

export default replaceShouldAllowMultiline;
