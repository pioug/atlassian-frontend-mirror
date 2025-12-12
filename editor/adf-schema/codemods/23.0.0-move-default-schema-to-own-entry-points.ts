import { createTransformer } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForDefaultSchema } from './migrates/update-default-schema-entry-points';

const transformer = createTransformer(updateImportEntryPointsForDefaultSchema);

export default transformer;
