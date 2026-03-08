import { createTransformer, type API, type FileInfo, type Options } from '@atlaskit/codemod-utils';
import { updateImportEntryPointsForBitbucketSchema } from './migrates/update-bitbucket-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForBitbucketSchema);

export default transformer;
