import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { BLANKET_PACKAGE_NAME } from './internal/constants';
import { renameCanClickThrough } from './migrations/rename-canclickthrough-to-shouldallowclickthrough';

const transformer = createTransformer(
  [renameCanClickThrough],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, BLANKET_PACKAGE_NAME),
);

export default transformer;
