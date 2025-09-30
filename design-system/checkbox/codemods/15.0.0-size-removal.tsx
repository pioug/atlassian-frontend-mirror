import type { API, FileInfo, Options } from 'jscodeshift';

import { removeSize } from './migrations/remove-props';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/checkbox', [removeSize]);

export default transformer;
