import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import moveObjectAppearanceToStyle from './migrations/11.0.0-lite-mode/move-object-appearance-to-style';
import removeThemeProp from './migrations/11.0.0-lite-mode/remove-theme-prop';

const transformer = createTransformer(
  [moveObjectAppearanceToStyle, removeThemeProp],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, '@atlaskit/lozenge'),
);

export default transformer;
