import { createTransformer } from '@atlaskit/codemod-utils';
import type { API, FileInfo, Options } from '@atlaskit/codemod-utils';

import { validatorExports, validatorTypes } from './migrates/entry-points';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer([
	...validatorTypes,
	...validatorExports,
]);

export default transformer;
