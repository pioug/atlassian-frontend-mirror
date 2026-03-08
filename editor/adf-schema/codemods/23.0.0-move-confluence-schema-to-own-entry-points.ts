import { createTransformer, type API, type FileInfo, type Options } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForConfluenceSchema } from './migrates/update-confluence-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForConfluenceSchema);

export default transformer;
