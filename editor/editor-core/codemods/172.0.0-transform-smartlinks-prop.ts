import type { FileInfo, API, Options } from 'jscodeshift';

import { renameSmartLinksProp } from './migrates/rename-smartlinks-prop';
import { createTransformer } from './utils';

const transformer: (fileInfo: FileInfo, _api: API, options: Options) => string = createTransformer(
	'@atlaskit/editor-core',
	[renameSmartLinksProp],
);

export default transformer;
