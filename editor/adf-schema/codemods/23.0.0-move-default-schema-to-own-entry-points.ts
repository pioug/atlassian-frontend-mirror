import type { API, FileInfo, Options } from '@atlaskit/codemod-utils';
import { createTransformer } from '@atlaskit/codemod-utils/utils';

import { updateImportEntryPointsForDefaultSchema } from './migrates/update-default-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForDefaultSchema);

export default transformer;
