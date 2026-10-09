import type { API, FileInfo, Options } from '@atlaskit/codemod-utils';
import { createTransformer } from '@atlaskit/codemod-utils/utils';

import { updateImportEntryPointsForBitbucketSchema } from './migrates/update-bitbucket-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForBitbucketSchema);

export default transformer;
