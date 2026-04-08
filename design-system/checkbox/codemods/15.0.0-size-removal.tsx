import type { API, FileInfo, Options } from 'jscodeshift';

import { removeSize } from './migrations/remove-size';
import { createTransformer } from './utils/create-transformer';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/checkbox', [removeSize]);

export default transformer;
