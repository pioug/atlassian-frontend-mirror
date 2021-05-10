import { JSCodeshift } from 'jscodeshift';
import { Collection } from 'jscodeshift/src/Collection';

import {
  createTransformer,
  hasImportDeclaration,
} from '@atlaskit/codemod-utils';

import removeLanguage from './migrations/14.0.0-lite-mode/remove-language';
import textToChild from './migrations/14.0.0-lite-mode/text-to-child';

const transformer = createTransformer(
  [removeLanguage, textToChild],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclaration(j, source, '@atlaskit/code'),
);

export default transformer;
