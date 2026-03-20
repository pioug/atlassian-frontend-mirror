import type { FileInfo, API, Options } from 'jscodeshift';

import { renameUnsafeCardProp } from './migrates/rename-unsafe-cards-prop';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer(
	'@atlaskit/editor-core',
	[renameUnsafeCardProp],
);

export default transformer;
