import type { API, FileInfo, Options } from 'jscodeshift';

import { removeAutoFocus } from './migrations/remove-props';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/modal-dialog', [removeAutoFocus]);

export default transformer;
