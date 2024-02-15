import type { Collection, JSCodeshift } from 'jscodeshift';

import {
  createTransformer,
  hasImportDeclarationFromAnyPackageEntrypoint,
} from '@atlaskit/codemod-utils';

import { mathToBinaryExpressions } from './migrations/math-to-binary-expressions';
import { wrapAkThemeProvider } from './migrations/wrap-ak-theme-provider';

const transformer = createTransformer(
  [mathToBinaryExpressions, wrapAkThemeProvider],
  (j: JSCodeshift, source: Collection<Node>) =>
    hasImportDeclarationFromAnyPackageEntrypoint(j, source, '@atlaskit/theme'),
);

export default transformer;
