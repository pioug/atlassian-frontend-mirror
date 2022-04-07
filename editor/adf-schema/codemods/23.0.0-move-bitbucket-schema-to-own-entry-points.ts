import { createTransformer } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForBitbucketSchema } from './migrates/update-bitbucket-schema-entry-points';

const transformer = createTransformer(
  updateImportEntryPointsForBitbucketSchema,
);

export default transformer;
