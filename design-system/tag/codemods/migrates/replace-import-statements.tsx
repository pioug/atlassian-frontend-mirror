import { replaceImportStatementFor } from '../utils';

const convertMap = {
  Tag: '@atlaskit/tag/removable-tag',
  SimpleTag: '@atlaskit/tag/simple-tag',
  TagColor: '@atlaskit/tag',
  default: '@atlaskit/tag/removable-tag',
  '*': '@atlaskit/tag/tag',
};

export const replaceImportStatement = replaceImportStatementFor(
  '@atlaskit/tag',
  convertMap,
);
