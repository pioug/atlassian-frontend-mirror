import { createTransformer } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForJiraSchema } from './migrates/update-jira-schema-entry-points';

const transformer = createTransformer(updateImportEntryPointsForJiraSchema);

export default transformer;
