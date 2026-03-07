import {
	createTransformer,
	type API,
	type FileInfo,
	type Options,
} from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForJiraSchema } from './migrates/update-jira-schema-entry-points';

const transformer: (
	fileInfo: FileInfo,
	{ jscodeshift }: API,
	options: Options,
) => string = createTransformer(updateImportEntryPointsForJiraSchema);

export default transformer;
