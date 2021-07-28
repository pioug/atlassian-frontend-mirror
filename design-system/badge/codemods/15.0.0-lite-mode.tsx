import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import { BADGE_PACKAGE_NAME } from './internal/constants';
import { moveObjectAppearanceToStyle } from './internal/move-object-appearance-to-style';

const transformer = createTransformer(
  [moveObjectAppearanceToStyle],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, BADGE_PACKAGE_NAME),
);

export default transformer;
