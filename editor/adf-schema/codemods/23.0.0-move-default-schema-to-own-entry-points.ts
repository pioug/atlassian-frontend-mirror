import {
	createTransformer,
	type API,
	type FileInfo,
	type Options,
} from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForDefaultSchema } from './migrates/update-default-schema-entry-points';

const transformer: (
	fileInfo: FileInfo,
	{ jscodeshift }: API,
	options: Options,
) => string = createTransformer(updateImportEntryPointsForDefaultSchema);

export default transformer;
