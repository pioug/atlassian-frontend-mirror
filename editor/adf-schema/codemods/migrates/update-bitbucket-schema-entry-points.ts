import { changeImportEntryPoint } from '@atlaskit/codemod-utils';

export const updateImportEntryPointsForBitbucketSchema = [
  changeImportEntryPoint(
    '@atlaskit/adf-schema',
    'bitbucketSchema',
    '@atlaskit/adf-schema/schema-bitbucket',
  ),
];
