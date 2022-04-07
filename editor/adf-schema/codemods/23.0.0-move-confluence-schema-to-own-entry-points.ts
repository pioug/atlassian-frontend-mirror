import { createTransformer } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForConfluenceSchema } from './migrates/update-confluence-schema-entry-points';

const transformer = createTransformer(
  updateImportEntryPointsForConfluenceSchema,
);

export default transformer;
