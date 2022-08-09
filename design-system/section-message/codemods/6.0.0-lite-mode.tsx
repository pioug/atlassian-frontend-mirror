import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { changeAppearanceProp } from './internal/change-appearance-prop';
import { SECTION_MESSAGE_PACKAGE_NAME } from './internal/constants';
import { mapActionsProp } from './internal/map-actions-prop';
import { hasDynamicImport } from './internal/utils';

const transformer = createTransformer(
  [changeAppearanceProp, mapActionsProp],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, SECTION_MESSAGE_PACKAGE_NAME) ||
    hasDynamicImport(j, source, SECTION_MESSAGE_PACKAGE_NAME),
);

export default transformer;
