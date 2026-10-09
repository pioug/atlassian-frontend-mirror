import type { API, FileInfo, Options } from '@atlaskit/codemod-utils';
import { createTransformer } from '@atlaskit/codemod-utils/utils';

import { updateImportEntryPointsForJiraSchema } from './migrates/update-jira-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForJiraSchema);

export default transformer;
