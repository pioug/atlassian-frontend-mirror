import { renameNamedImportWithAliasName } from '@atlaskit/codemod-utils';

export const renamePaginationPropTypeToPaginationProps = renameNamedImportWithAliasName(
  '@atlaskit/pagination',
  'PaginationPropTypes',
  'PaginationProps',
);
