import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { flattenI18nInnerPropsAsProp } from './migrations/flatten-i18n-props';
import { removeCollapseRange } from './migrations/remove-collapase-range';
import { removeI18nProps } from './migrations/remove-i18n-props';
import { renameInnerStylesProps } from './migrations/rename-inner-styles-props';
import { renamePaginationPropTypeToPaginationProps } from './migrations/rename-pagination-prop-types';
import {
  renameNextProp,
  renamePrevProp,
} from './migrations/rename-prev-next-label';

const PAGINATION_PACKAGE = '@atlaskit/pagination';
const transformer = createTransformer(
  [
    renameInnerStylesProps,
    renamePaginationPropTypeToPaginationProps,
    flattenI18nInnerPropsAsProp,
    removeI18nProps,
    renameNextProp,
    renamePrevProp,
    removeCollapseRange,
  ],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, PAGINATION_PACKAGE),
);

export default transformer;
