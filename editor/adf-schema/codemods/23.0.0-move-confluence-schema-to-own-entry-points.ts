import type { API, FileInfo, Options } from '@atlaskit/codemod-utils';
import { createTransformer } from '@atlaskit/codemod-utils/utils';

import { updateImportEntryPointsForConfluenceSchema } from './migrates/update-confluence-schema-entry-points';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer(updateImportEntryPointsForConfluenceSchema);

export default transformer;
