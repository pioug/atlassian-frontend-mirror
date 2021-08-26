import core from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import { renameNamedImportWithAliasName as createAliasImportFor } from '@atlaskit/codemod-utils';

import {
  MODAL_BODY_TYPE_NAME,
  MODAL_FOOTER_TYPE_NAME,
  MODAL_HEADER_TYPE_NAME,
  MODAL_TITLE_TYPE_NAME,
  PACKAGE_NAME,
} from '../internal/constants';

export const renameInnerComponentPropTypes = (
  j: core.JSCodeshift,
  source: Collection<Node>,
) => {
  const aliases = [
    { name: 'HeaderComponentProps', as: MODAL_HEADER_TYPE_NAME },
    { name: 'TitleComponentProps', as: MODAL_TITLE_TYPE_NAME },
    { name: 'BodyComponentProps', as: MODAL_BODY_TYPE_NAME },
    { name: 'FooterComponentProps', as: MODAL_FOOTER_TYPE_NAME },
  ];

  aliases
    .map(({ name, as }) => createAliasImportFor(PACKAGE_NAME, name, as))
    .forEach((createAlias) => createAlias(j, source));
};
