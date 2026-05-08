import type { API, FileInfo, Options } from 'jscodeshift';

import { removeBooleanAutoFocus } from './migrations/remove-props';
import { createTransformer } from './utils/create-transformer';

const transformer: (fileInfo: FileInfo, { jscodeshift }: API, options: Options) => string =
	createTransformer('@atlaskit/modal-dialog', [removeBooleanAutoFocus]);

export default transformer;
